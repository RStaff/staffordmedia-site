import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const body = JSON.stringify({ schema: "staffordmedia.automation_inquiry.v1", submissionId: "web_test", email: "owner@example.com", contactAcknowledgement: true });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  delete process.env.STAFFORDOS_INTAKE_API_URL;
  delete process.env.INTERNAL_API_KEY;
});

describe("automation inquiry forwarding", () => {
  it("forwards only through server configuration and returns durable acceptance", async () => {
    process.env.STAFFORDOS_INTAKE_API_URL = "https://api.example.test";
    process.env.INTERNAL_API_KEY = "test-only-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ inquiryId: "inq_1", status: "NEEDS_REVIEW" }), { status: 201 })));
    const response = await POST(new Request("http://site.test/api/automation-inquiries", { method: "POST", headers: { "content-type": "application/json", origin: "http://site.test", "x-forwarded-for": "10.0.0.1" }, body }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, inquiryId: "inq_1" });
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ headers: expect.objectContaining({ "x-internal-api-key": "test-only-key", "x-stafford-visitor-token": expect.stringMatching(/^v1\./) }) });
  });

  it("rejects cross-site or absent Origin before forwarding", async () => {
    process.env.STAFFORDOS_INTAKE_API_URL = "https://api.example.test";
    process.env.INTERNAL_API_KEY = "test-only-key";
    vi.stubGlobal("fetch", vi.fn());
    for (const origin of ["https://elsewhere.test", undefined]) {
      const headers = new Headers({ "content-type": "application/json" });
      if (origin) headers.set("origin", origin);
      const response = await POST(new Request("https://site.test/api/automation-inquiries", { method: "POST", headers, body }));
      expect(response.status).toBe(403);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts the public domain behind a proxy and rejects invalid origin or content type", async () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.STAFFORDOS_INTAKE_API_URL = "https://api.example.test";
    process.env.INTERNAL_API_KEY = "test-only-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ inquiryId: "inq_2", status: "NEEDS_REVIEW" }), { status: 201 })));
    const url = "http://internal-render-host/api/automation-inquiries";
    const valid = await POST(new Request(url, { method: "POST", headers: { "content-type": "application/json", origin: "https://www.staffordmedia.ai" }, body }));
    expect(valid.status).toBe(200);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);

    const crossSite = await POST(new Request(url, { method: "POST", headers: { "content-type": "application/json", origin: "https://elsewhere.test" }, body }));
    expect(crossSite.status).toBe(403);
    const nonJson = await POST(new Request(url, { method: "POST", headers: { "content-type": "text/plain", origin: "https://staffordmedia.ai" }, body }));
    expect(nonJson.status).toBe(415);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it("does not claim receipt when the service is unavailable and forwards provider throttling", async () => {
    process.env.STAFFORDOS_INTAKE_API_URL = "https://api.example.test";
    process.env.INTERNAL_API_KEY = "test-only-key";
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const failed = await POST(new Request("http://site.test", { method: "POST", headers: { "content-type": "application/json", origin: "http://site.test", "x-forwarded-for": "10.0.0.2" }, body }));
    expect(failed.status).toBe(503);
    expect(await failed.json()).not.toHaveProperty("inquiryId");

    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ error: "INQUIRY_RATE_LIMITED" }), { status: 429, headers: { "Retry-After": "321" } }));
    const limited = await POST(new Request("http://site.test", { method: "POST", headers: { "content-type": "application/json", origin: "http://site.test", "x-forwarded-for": "forged" }, body }));
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).toBe("321");
  });
});
