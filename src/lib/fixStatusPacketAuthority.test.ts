import { describe, expect, it, vi } from "vitest";
import {
  FIX_STATUS_PACKET_API_BASE_ENV,
  getFixStatusCopy,
  mapPacketToMerchantState,
  validateFixStatusRequest,
  type PacketAuthorityPacket,
} from "./fixStatusPacketAuthority";

const env = {
  [FIX_STATUS_PACKET_API_BASE_ENV]: "https://cart-agent-api-test.onrender.com",
};

const basePacket: PacketAuthorityPacket = {
  packet_id: "packet_test_store_abc123",
  store_domain: "test-store.invalid",
  payment_reference: "cs_test_123",
  reservation_id: "res_123",
  status: "payment_pending",
  execution_status: "not_started",
  proof_status: "not_started",
  completion_status: "not_started",
  updated_at: "2026-07-24T19:00:00.000Z",
};

function params(overrides: Record<string, string> = {}) {
  return {
    packet_id: "packet_test_store_abc123",
    session_id: "cs_test_123",
    store: "test-store.invalid",
    reservation_id: "res_123",
    ...overrides,
  };
}

function packetResponse(packet: PacketAuthorityPacket, status = 200) {
  return vi.fn(async (url: string) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ ok: true, packet }),
    url,
  })) as unknown as typeof fetch;
}

function notFoundResponse() {
  return vi.fn(async () => ({
    ok: false,
    status: 404,
    json: async () => ({ ok: false, error: "packet_not_found" }),
  })) as unknown as typeof fetch;
}

describe("validateFixStatusRequest", () => {
  it("fails closed when packet_id is missing", async () => {
    const result = await validateFixStatusRequest(params({ packet_id: "" }), { env, fetchImpl: packetResponse(basePacket) });
    expect(result.state).toBe("INVALID_REQUEST");
    expect(result.reason).toBe("missing_required_identifier");
  });

  it("fails closed when session_id is missing", async () => {
    const result = await validateFixStatusRequest(params({ session_id: "" }), { env, fetchImpl: packetResponse(basePacket) });
    expect(result.state).toBe("INVALID_REQUEST");
  });

  it("fails closed when store is missing", async () => {
    const result = await validateFixStatusRequest(params({ store: "" }), { env, fetchImpl: packetResponse(basePacket) });
    expect(result.state).toBe("INVALID_REQUEST");
  });

  it("returns not found for packet API 404", async () => {
    const result = await validateFixStatusRequest(params(), { env, fetchImpl: notFoundResponse() });
    expect(result.state).toBe("NOT_FOUND_OR_MISMATCH");
    expect(result.reason).toBe("packet_not_found");
  });

  it("returns service unavailable on API network failure", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network failed");
    }) as unknown as typeof fetch;
    const result = await validateFixStatusRequest(params(), { env, fetchImpl });
    expect(result.state).toBe("SERVICE_UNAVAILABLE");
  });

  it("rejects packet ID mismatch", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, packet_id: "packet_other" }),
    });
    expect(result.state).toBe("NOT_FOUND_OR_MISMATCH");
    expect(result.reason).toBe("packet_id_mismatch");
  });

  it("rejects session ID mismatch", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, payment_reference: "cs_test_other" }),
    });
    expect(result.state).toBe("NOT_FOUND_OR_MISMATCH");
    expect(result.reason).toBe("session_id_mismatch");
  });

  it("rejects store mismatch", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, store_domain: "other-store.invalid" }),
    });
    expect(result.state).toBe("NOT_FOUND_OR_MISMATCH");
    expect(result.reason).toBe("store_mismatch");
  });

  it("returns unpaid for a valid payment_pending packet", async () => {
    const result = await validateFixStatusRequest(params(), { env, fetchImpl: packetResponse(basePacket) });
    expect(result.state).toBe("UNPAID");
    expect(result.packet?.packet_id).toBe(basePacket.packet_id);
  });

  it("returns payment received for a valid paid packet with active execution", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, status: "payment_received", execution_status: "in_progress" }),
    });
    expect(result.state).toBe("PAID_OR_PAYMENT_RECEIVED");
  });

  it("returns execution pending for a valid paid packet without execution", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, status: "payment_received", execution_status: "not_started" }),
    });
    expect(result.state).toBe("EXECUTION_PENDING");
  });

  it("returns proof ready when proof or completion state proves availability", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, status: "payment_received", proof_status: "ready" }),
    });
    expect(result.state).toBe("PROOF_READY_OR_COMPLETED");
  });

  it("renders unknown packet status as review instead of a positive request-open state", async () => {
    const result = await validateFixStatusRequest(params(), {
      env,
      fetchImpl: packetResponse({ ...basePacket, status: "mystery_state" }),
    });
    expect(result.state).toBe("STATUS_REVIEW");
    expect(getFixStatusCopy(result.state).headline).not.toMatch(/request is open/i);
  });

  it("uses the explicit test API origin", async () => {
    const fetchImpl = packetResponse(basePacket);
    await validateFixStatusRequest(params(), { env, fetchImpl });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://cart-agent-api-test.onrender.com/api/packets/packet_test_store_abc123",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("does not fall back to production when API origin is absent", async () => {
    const fetchImpl = packetResponse(basePacket);
    const result = await validateFixStatusRequest(params(), { env: {}, fetchImpl });
    expect(result.state).toBe("SERVICE_UNAVAILABLE");
    expect(result.reason).toBe("missing_api_origin");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("never calls an operator endpoint", async () => {
    const fetchImpl = packetResponse(basePacket);
    await validateFixStatusRequest(params(), { env, fetchImpl });
    const calledUrl = String(vi.mocked(fetchImpl).mock.calls[0]?.[0] || "");
    expect(calledUrl).toContain("/api/packets/");
    expect(calledUrl).not.toContain("/api/operator/");
  });
});

describe("mapPacketToMerchantState", () => {
  it("maps unsupported packet statuses to review", () => {
    expect(mapPacketToMerchantState({ ...basePacket, status: "unexpected" })).toBe("STATUS_REVIEW");
  });
});
