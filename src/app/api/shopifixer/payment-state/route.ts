import { NextResponse } from "next/server";
import {
  cleanStoreDomain,
  createPacketFromVerifiedPayment,
  isMinimumLifecycleState,
  lookupPacket,
  updatePacketState,
} from "@/lib/minimumStateContinuity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const packetId = url.searchParams.get("packet") || "";
  const store = cleanStoreDomain(url.searchParams.get("store") || "");
  const result = await lookupPacket({ packetId, store });

  if (result.status === "missing") {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 404 });
  }

  return NextResponse.json({ ok: true, packet: result.packet });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const action = String(body.action || "verify_payment");

  if (action === "update_state") {
    const packetId = String(body.packet_id || body.packet || "");
    const state = String(body.state || "");
    const note = String(body.note || "Manual operator state update.").trim();

    if (!packetId) return NextResponse.json({ ok: false, error: "PACKET_REQUIRED" }, { status: 400 });
    if (!isMinimumLifecycleState(state)) return NextResponse.json({ ok: false, error: "INVALID_STATE" }, { status: 400 });

    try {
      const packet = await updatePacketState(packetId, state, note);
      return NextResponse.json({ ok: true, packet });
    } catch (error) {
      const message = error instanceof Error ? error.message : "STATE_UPDATE_FAILED";
      return NextResponse.json({ ok: false, error: message }, { status: 404 });
    }
  }

  const store = cleanStoreDomain(String(body.store || body.store_url || ""));
  const paymentReference = String(body.payment_reference || body.paymentReference || body.commitment_reference || "").trim();
  const merchantContact = body.merchant_contact || body.merchantContact || null;
  const operatorVerified = body.operator_verified === true || body.verified === true;

  if (!operatorVerified) return NextResponse.json({ ok: false, error: "OPERATOR_VERIFICATION_REQUIRED" }, { status: 400 });
  if (!store) return NextResponse.json({ ok: false, error: "STORE_REQUIRED" }, { status: 400 });
  if (!paymentReference) return NextResponse.json({ ok: false, error: "PAYMENT_REFERENCE_REQUIRED" }, { status: 400 });

  try {
    const packet = await createPacketFromVerifiedPayment({
      store,
      paymentReference,
      merchantContact: merchantContact ? String(merchantContact) : null,
    });

    return NextResponse.json({ ok: true, packet });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PACKET_CREATION_FAILED";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
