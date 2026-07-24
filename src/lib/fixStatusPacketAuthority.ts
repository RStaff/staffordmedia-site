export const FIX_STATUS_PACKET_API_BASE_ENV = "NEXT_PUBLIC_SHOPIFIXER_CHECKOUT_API_BASE";

export type FixStatusMerchantState =
  | "LOADING"
  | "INVALID_REQUEST"
  | "NOT_FOUND_OR_MISMATCH"
  | "UNPAID"
  | "WEBHOOK_PENDING"
  | "PAID_OR_PAYMENT_RECEIVED"
  | "EXECUTION_PENDING"
  | "PROOF_READY_OR_COMPLETED"
  | "SERVICE_UNAVAILABLE"
  | "STATUS_REVIEW";

export type FixStatusQuery = {
  packet?: string;
  packet_id?: string;
  session_id?: string;
  store?: string;
  reservation_id?: string;
};

export type PacketAuthorityPacket = {
  packet_id?: string;
  packetId?: string;
  store_domain?: string;
  store_url?: string;
  reservation_id?: string | null;
  reservationId?: string | null;
  payment_reference?: string | null;
  paymentReference?: string | null;
  status?: string | null;
  execution_status?: string | null;
  executionStatus?: string | null;
  proof_status?: string | null;
  proofStatus?: string | null;
  completion_status?: string | null;
  completionStatus?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
  merchant_next_action?: string | null;
  merchantNextAction?: string | null;
};

export type FixStatusValidationResult = {
  state: FixStatusMerchantState;
  reason:
    | "missing_required_identifier"
    | "malformed_identifier"
    | "missing_api_origin"
    | "invalid_api_origin"
    | "packet_not_found"
    | "api_unavailable"
    | "invalid_api_payload"
    | "packet_id_mismatch"
    | "session_id_mismatch"
    | "store_mismatch"
    | "reservation_id_mismatch"
    | "validated";
  params: {
    packetId: string;
    sessionId: string;
    store: string;
    reservationId: string;
  };
  apiBase?: string;
  packet: PacketAuthorityPacket | null;
};

type FetchLike = typeof fetch;

const identifierPattern = /^[A-Za-z0-9_.:-]+$/;
const storePattern = /^[a-z0-9.-]+$/;

export function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0];
}

function normalizeIdentifier(value: unknown) {
  return String(value ?? "").trim();
}

function normalizePacketId(packet: PacketAuthorityPacket) {
  return normalizeIdentifier(packet.packet_id || packet.packetId);
}

function normalizePaymentReference(packet: PacketAuthorityPacket) {
  return normalizeIdentifier(packet.payment_reference || packet.paymentReference);
}

function normalizeReservationId(packet: PacketAuthorityPacket) {
  return normalizeIdentifier(packet.reservation_id || packet.reservationId);
}

function normalizePacketStore(packet: PacketAuthorityPacket) {
  return cleanStoreDomain(String(packet.store_domain || packet.store_url || ""));
}

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function isSafeIdentifier(value: string) {
  return Boolean(value && identifierPattern.test(value));
}

function isSafeStore(value: string) {
  return Boolean(value && storePattern.test(value));
}

function resolvePacketApiBase(env: NodeJS.ProcessEnv = process.env) {
  const raw = String(env[FIX_STATUS_PACKET_API_BASE_ENV] || "").trim();
  if (!raw) {
    return { ok: false as const, reason: "missing_api_origin" as const };
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { ok: false as const, reason: "invalid_api_origin" as const };
    }

    return {
      ok: true as const,
      apiBase: url.toString().replace(/\/+$/, ""),
    };
  } catch {
    return { ok: false as const, reason: "invalid_api_origin" as const };
  }
}

export function normalizeFixStatusQuery(params: FixStatusQuery = {}) {
  return {
    packetId: normalizeIdentifier(params.packet_id || params.packet),
    sessionId: normalizeIdentifier(params.session_id),
    store: cleanStoreDomain(params.store || ""),
    reservationId: normalizeIdentifier(params.reservation_id),
  };
}

export function mapPacketToMerchantState(packet: PacketAuthorityPacket): FixStatusMerchantState {
  const status = normalizeStatus(packet.status);
  const executionStatus = normalizeStatus(packet.execution_status || packet.executionStatus);
  const proofStatus = normalizeStatus(packet.proof_status || packet.proofStatus);
  const completionStatus = normalizeStatus(packet.completion_status || packet.completionStatus);

  if (proofStatus === "ready" || proofStatus === "delivered" || completionStatus === "complete") {
    return "PROOF_READY_OR_COMPLETED";
  }

  if (status === "payment_received" || status === "paid") {
    if (!executionStatus || executionStatus === "not_started" || executionStatus === "pending") {
      return "EXECUTION_PENDING";
    }

    return "PAID_OR_PAYMENT_RECEIVED";
  }

  if (status === "payment_pending" || status === "prepared") {
    return "UNPAID";
  }

  return "STATUS_REVIEW";
}

export async function validateFixStatusRequest(
  params: FixStatusQuery,
  options: {
    env?: NodeJS.ProcessEnv;
    fetchImpl?: FetchLike;
  } = {},
): Promise<FixStatusValidationResult> {
  const normalized = normalizeFixStatusQuery(params);
  const fetchImpl = options.fetchImpl || fetch;

  const baseResult = {
    params: normalized,
    packet: null,
  };

  if (!normalized.packetId || !normalized.sessionId || !normalized.store) {
    return {
      ...baseResult,
      state: "INVALID_REQUEST",
      reason: "missing_required_identifier",
    };
  }

  if (
    !isSafeIdentifier(normalized.packetId) ||
    !isSafeIdentifier(normalized.sessionId) ||
    !isSafeStore(normalized.store) ||
    (normalized.reservationId && !isSafeIdentifier(normalized.reservationId))
  ) {
    return {
      ...baseResult,
      state: "INVALID_REQUEST",
      reason: "malformed_identifier",
    };
  }

  const apiBase = resolvePacketApiBase(options.env);
  if (!apiBase.ok) {
    return {
      ...baseResult,
      state: "SERVICE_UNAVAILABLE",
      reason: apiBase.reason,
    };
  }

  try {
    const response = await fetchImpl(`${apiBase.apiBase}/api/packets/${encodeURIComponent(normalized.packetId)}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        state: "NOT_FOUND_OR_MISMATCH",
        reason: "packet_not_found",
      };
    }

    if (!response.ok) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        state: "SERVICE_UNAVAILABLE",
        reason: "api_unavailable",
      };
    }

    const json = await response.json();
    const packet = json?.packet;

    if (!packet || typeof packet !== "object" || Array.isArray(packet)) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        state: "NOT_FOUND_OR_MISMATCH",
        reason: "invalid_api_payload",
      };
    }

    const typedPacket = packet as PacketAuthorityPacket;
    const packetId = normalizePacketId(typedPacket);
    const paymentReference = normalizePaymentReference(typedPacket);
    const packetStore = normalizePacketStore(typedPacket);
    const storedReservationId = normalizeReservationId(typedPacket);

    if (packetId !== normalized.packetId) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        packet: typedPacket,
        state: "NOT_FOUND_OR_MISMATCH",
        reason: "packet_id_mismatch",
      };
    }

    if (paymentReference !== normalized.sessionId) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        packet: typedPacket,
        state: "NOT_FOUND_OR_MISMATCH",
        reason: "session_id_mismatch",
      };
    }

    if (packetStore !== normalized.store) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        packet: typedPacket,
        state: "NOT_FOUND_OR_MISMATCH",
        reason: "store_mismatch",
      };
    }

    if (normalized.reservationId && storedReservationId && storedReservationId !== normalized.reservationId) {
      return {
        ...baseResult,
        apiBase: apiBase.apiBase,
        packet: typedPacket,
        state: "NOT_FOUND_OR_MISMATCH",
        reason: "reservation_id_mismatch",
      };
    }

    return {
      ...baseResult,
      apiBase: apiBase.apiBase,
      packet: typedPacket,
      state: mapPacketToMerchantState(typedPacket),
      reason: "validated",
    };
  } catch {
    return {
      ...baseResult,
      apiBase: apiBase.apiBase,
      state: "SERVICE_UNAVAILABLE",
      reason: "api_unavailable",
    };
  }
}

export function getFixStatusCopy(state: FixStatusMerchantState) {
  switch (state) {
    case "LOADING":
      return {
        label: "Checking status",
        headline: "Checking your fix request.",
        body: "Packet authority is being checked before any status is shown.",
      };
    case "INVALID_REQUEST":
      return {
        label: "Link required",
        headline: "We need a valid status link.",
        body: "Use the payment return link tied to this store.",
      };
    case "NOT_FOUND_OR_MISMATCH":
      return {
        label: "Request not verified",
        headline: "We could not verify this fix request.",
        body: "This link does not match an active ShopiFixer packet.",
      };
    case "SERVICE_UNAVAILABLE":
      return {
        label: "Status unavailable",
        headline: "Status is temporarily unavailable.",
        body: "Packet authority could not be reached. Try the same link again shortly.",
      };
    case "UNPAID":
      return {
        label: "Payment pending",
        headline: "Payment has not been confirmed yet.",
        body: "Your request is reserved, but work starts only after payment is verified.",
      };
    case "WEBHOOK_PENDING":
      return {
        label: "Verification pending",
        headline: "Payment verification is still catching up.",
        body: "Keep this page open while packet authority receives the payment confirmation.",
      };
    case "EXECUTION_PENDING":
      return {
        label: "Payment received",
        headline: "Payment is confirmed. Your fix is queued.",
        body: "The packet is ready for the next controlled execution step.",
      };
    case "PAID_OR_PAYMENT_RECEIVED":
      return {
        label: "Payment received",
        headline: "Your fix request is verified.",
        body: "Your ShopiFixer packet is connected and ready for the next governed step.",
      };
    case "PROOF_READY_OR_COMPLETED":
      return {
        label: "Proof ready",
        headline: "Before-and-after review is ready.",
        body: "Review the visible proof tied to this packet.",
      };
    default:
      return {
        label: "Reviewing status",
        headline: "We are reviewing this status.",
        body: "Packet authority returned a state that needs operator review before we show the next step.",
      };
  }
}

export function publicProofLabel(packet: PacketAuthorityPacket | null) {
  if (!packet) return "Not available";

  const proofStatus = normalizeStatus(packet.proof_status || packet.proofStatus);
  const completionStatus = normalizeStatus(packet.completion_status || packet.completionStatus);
  const status = normalizeStatus(packet.status);

  if (proofStatus === "ready" || proofStatus === "delivered" || completionStatus === "complete") {
    return "Proof ready";
  }

  if (status === "payment_received" || status === "paid") {
    return "Payment received";
  }

  if (status === "payment_pending" || status === "prepared") {
    return "Payment pending";
  }

  return "Under review";
}

export function displayPacketReference(packet: PacketAuthorityPacket | null) {
  const packetId = packet ? normalizePacketId(packet) : "";
  if (!packetId) return "Not verified";
  if (packetId.length <= 18) return packetId;
  return `${packetId.slice(0, 10)}...${packetId.slice(-6)}`;
}

export function packetUpdatedAt(packet: PacketAuthorityPacket | null) {
  return normalizeIdentifier(packet?.updated_at || packet?.updatedAt || packet?.created_at || packet?.createdAt);
}

export function merchantNextActionForResult(result: FixStatusValidationResult) {
  if (result.packet?.merchant_next_action || result.packet?.merchantNextAction) {
    return String(result.packet.merchant_next_action || result.packet.merchantNextAction);
  }

  switch (result.state) {
    case "UNPAID":
      return "Return to checkout if payment was not completed.";
    case "EXECUTION_PENDING":
    case "PAID_OR_PAYMENT_RECEIVED":
      return "Watch for the next governed fix update.";
    case "PROOF_READY_OR_COMPLETED":
      return "Open the proof review for this packet.";
    case "SERVICE_UNAVAILABLE":
      return "Use the same link again after status reconnects.";
    default:
      return "Use the verified payment return link for this store.";
  }
}

export function buildContinuityHref(pathname: string, result: FixStatusValidationResult) {
  if (!result.packet) return pathname;

  const query = new URLSearchParams();
  query.set("store", normalizePacketStore(result.packet));
  query.set("packet", normalizePacketId(result.packet));
  query.set("packet_id", normalizePacketId(result.packet));
  query.set("session_id", normalizePaymentReference(result.packet));

  const reservationId = normalizeReservationId(result.packet);
  if (reservationId) query.set("reservation_id", reservationId);

  return `${pathname}?${query.toString()}`;
}
