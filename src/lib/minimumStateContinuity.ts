import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type MinimumLifecycleState =
  | "payment_verified"
  | "intake_pending"
  | "intake_started"
  | "implementation_in_progress"
  | "awaiting_review"
  | "proof_ready"
  | "complete"
  | "unresolved"
  | "reverted";

export type MinimumPacket = {
  packet_id: string;
  store_url: string;
  merchant_contact: string | null;
  payment_reference: string;
  current_lifecycle_state: MinimumLifecycleState;
  intake_state: "intake_pending" | "intake_started" | "intake_incomplete";
  fulfillment_state: MinimumLifecycleState;
  proof_state: "not_ready" | "ready" | "delivered";
  completion_state: "not_started" | "ready_for_closeout" | "complete" | "unresolved";
  created_at: string;
  updated_at: string;
  operator_owner: "Ross";
  merchant_next_action: string;
  operator_next_action: string;
  unresolved_reason: string | null;
  state_history: Array<{
    state: MinimumLifecycleState;
    at: string;
    note: string;
  }>;
};

export type PacketLookupResult =
  | { status: "found"; packet: MinimumPacket }
  | { status: "missing"; reason: "packet_not_found" | "store_not_found" | "packet_not_requested" };

const ROOT = process.cwd();
const PACKET_DIR = path.join(ROOT, "staffordos", "runtime", "merchant_packets");
const PACKET_INDEX = path.join(PACKET_DIR, "index.json");

export const minimumLifecycleStates: MinimumLifecycleState[] = [
  "payment_verified",
  "intake_pending",
  "intake_started",
  "implementation_in_progress",
  "awaiting_review",
  "proof_ready",
  "complete",
  "unresolved",
  "reverted",
];

export function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export function isMinimumLifecycleState(value: string): value is MinimumLifecycleState {
  return minimumLifecycleStates.includes(value as MinimumLifecycleState);
}

function slugify(value: string) {
  return cleanStoreDomain(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown-store";
}

function shortHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 10);
}

function packetPath(packetId: string) {
  return path.join(PACKET_DIR, `${packetId}.json`);
}

async function ensurePacketDir() {
  await mkdir(PACKET_DIR, { recursive: true });
}

async function writePacket(packet: MinimumPacket) {
  await ensurePacketDir();
  await writeFile(packetPath(packet.packet_id), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  await writePacketIndex();
}

async function readPacketFile(filePath: string): Promise<MinimumPacket | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as MinimumPacket;
  } catch {
    return null;
  }
}

export async function readPacketById(packetId: string): Promise<MinimumPacket | null> {
  const safePacketId = String(packetId || "").trim();
  if (!safePacketId || safePacketId.includes("/") || safePacketId.includes("\\")) return null;
  return readPacketFile(packetPath(safePacketId));
}

export async function readAllPackets(): Promise<MinimumPacket[]> {
  await ensurePacketDir();
  const entries = await readdir(PACKET_DIR, { withFileTypes: true });
  const packets = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json")
      .map((entry) => readPacketFile(path.join(PACKET_DIR, entry.name))),
  );

  return packets.filter((packet): packet is MinimumPacket => Boolean(packet));
}

export async function readLatestPacketForStore(store: string): Promise<MinimumPacket | null> {
  const domain = cleanStoreDomain(store);
  if (!domain) return null;

  const packets = await readAllPackets();
  return (
    packets
      .filter((packet) => cleanStoreDomain(packet.store_url) === domain)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0] || null
  );
}

export async function lookupPacket(params: { packetId?: string; store?: string }): Promise<PacketLookupResult> {
  if (params.packetId) {
    const packet = await readPacketById(params.packetId);
    return packet ? { status: "found", packet } : { status: "missing", reason: "packet_not_found" };
  }

  if (params.store) {
    const packet = await readLatestPacketForStore(params.store);
    return packet ? { status: "found", packet } : { status: "missing", reason: "store_not_found" };
  }

  return { status: "missing", reason: "packet_not_requested" };
}

export async function createPacketFromVerifiedPayment(input: {
  store: string;
  paymentReference: string;
  merchantContact?: string | null;
}): Promise<MinimumPacket> {
  const storeUrl = cleanStoreDomain(input.store);
  const paymentReference = String(input.paymentReference || "").trim();
  if (!storeUrl) throw new Error("STORE_REQUIRED");
  if (!paymentReference) throw new Error("PAYMENT_REFERENCE_REQUIRED");

  const existing = (await readAllPackets()).find((packet) => packet.payment_reference === paymentReference);
  if (existing) return existing;

  const now = new Date().toISOString();
  const packetId = `packet_${slugify(storeUrl)}_${shortHash(`${storeUrl}:${paymentReference}`)}`;
  const packet: MinimumPacket = {
    packet_id: packetId,
    store_url: storeUrl,
    merchant_contact: input.merchantContact ? String(input.merchantContact).trim() : null,
    payment_reference: paymentReference,
    current_lifecycle_state: "intake_pending",
    intake_state: "intake_pending",
    fulfillment_state: "intake_pending",
    proof_state: "not_ready",
    completion_state: "not_started",
    created_at: now,
    updated_at: now,
    operator_owner: "Ross",
    merchant_next_action: "Watch for intake confirmation and provide any missing store, access, or approval contact details.",
    operator_next_action: "Confirm payment, audit context, merchant contact, and send the intake acknowledgement.",
    unresolved_reason: null,
    state_history: [
      {
        state: "payment_verified",
        at: now,
        note: "Payment or operator-confirmed commercial commitment was verified.",
      },
      {
        state: "intake_pending",
        at: now,
        note: "Packet created and intake is pending. Implementation, proof, and completion are not active.",
      },
    ],
  };

  await writePacket(packet);
  return packet;
}

export async function updatePacketState(packetId: string, nextState: MinimumLifecycleState, note: string) {
  const packet = await readPacketById(packetId);
  if (!packet) throw new Error("PACKET_NOT_FOUND");

  const now = new Date().toISOString();
  const next: MinimumPacket = {
    ...packet,
    current_lifecycle_state: nextState,
    fulfillment_state: nextState,
    intake_state: nextState === "intake_started" ? "intake_started" : packet.intake_state,
    proof_state: nextState === "proof_ready" || nextState === "complete" ? "ready" : packet.proof_state,
    completion_state: nextState === "complete" ? "ready_for_closeout" : nextState === "unresolved" ? "unresolved" : packet.completion_state,
    unresolved_reason: nextState === "unresolved" ? note : packet.unresolved_reason,
    updated_at: now,
    operator_next_action: nextOperatorAction(nextState),
    merchant_next_action: nextMerchantAction(nextState),
    state_history: [
      ...packet.state_history,
      {
        state: nextState,
        at: now,
        note,
      },
    ],
  };

  await writePacket(next);
  return next;
}

function nextOperatorAction(state: MinimumLifecycleState) {
  switch (state) {
    case "intake_started":
      return "Collect missing intake details and confirm scoped review requirements.";
    case "implementation_in_progress":
      return "Keep work inside the approved scope and prepare validation notes.";
    case "awaiting_review":
      return "Review packet state and request the next merchant decision.";
    case "proof_ready":
      return "Attach proof references and prepare merchant proof review.";
    case "complete":
      return "Deliver closeout request and record merchant confirmation or revision.";
    case "unresolved":
      return "Name the blocker, owner, and next decision before work continues.";
    case "reverted":
      return "Record what changed back, why, and what proof remains valid.";
    default:
      return "Confirm payment, audit context, merchant contact, and send the intake acknowledgement.";
  }
}

function nextMerchantAction(state: MinimumLifecycleState) {
  switch (state) {
    case "intake_started":
      return "Provide any missing store, access, or approval contact details.";
    case "implementation_in_progress":
      return "Wait for the next implementation update or proof review request.";
    case "awaiting_review":
      return "Review the scoped packet and provide the requested decision.";
    case "proof_ready":
      return "Review the proof packet and confirm acceptance, revision, or question.";
    case "complete":
      return "Confirm closeout or request a bounded revision.";
    case "unresolved":
      return "Respond to the named blocker or scope decision.";
    case "reverted":
      return "Review the reversion note and confirm the next direction.";
    default:
      return "Watch for intake confirmation and provide any missing store, access, or approval contact details.";
  }
}

async function writePacketIndex() {
  const packets = await readAllPackets();
  const index = {
    status: "MINIMUM_MERCHANT_PACKET_INDEX",
    updated_at: new Date().toISOString(),
    packets: packets
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map((packet) => ({
        packet_id: packet.packet_id,
        store_url: packet.store_url,
        payment_reference: packet.payment_reference,
        current_lifecycle_state: packet.current_lifecycle_state,
        intake_state: packet.intake_state,
        proof_state: packet.proof_state,
        completion_state: packet.completion_state,
        operator_owner: packet.operator_owner,
        operator_next_action: packet.operator_next_action,
        merchant_next_action: packet.merchant_next_action,
        updated_at: packet.updated_at,
      })),
  };

  await writeFile(PACKET_INDEX, `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

export function packetHref(pathname: string, packet: MinimumPacket) {
  return `${pathname}?store=${encodeURIComponent(packet.store_url)}&packet=${encodeURIComponent(packet.packet_id)}`;
}
