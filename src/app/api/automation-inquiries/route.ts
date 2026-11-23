import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

function visitorToken(request: Request, secret: string) {
  const cookie = request.headers.get("cookie")?.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith("stafford_visitor="))?.slice("stafford_visitor=".length);
  if (cookie && /^v1\.[A-Za-z0-9_-]{32}\.\d+\.[A-Za-z0-9_-]{43}$/.test(cookie)) return { token: cookie, fresh: false };
  const id = crypto.randomBytes(24).toString("base64url");
  const issued = String(Date.now());
  const unsigned = `v1.${id}.${issued}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned, "utf8").digest("base64url");
  return { token: `${unsigned}.${signature}`, fresh: true };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://staffordmedia.ai", "https://www.staffordmedia.ai"]
    : [new URL(request.url).origin];
  if (!origin || !allowedOrigins.includes(origin)) return NextResponse.json({ ok: false, error: "INQUIRY_ORIGIN_INVALID" }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return NextResponse.json({ ok: false, error: "INQUIRY_PAYLOAD_INVALID" }, { status: 415 });
  const target = String(process.env.STAFFORDOS_INTAKE_API_URL || "").trim().replace(/\/$/, "");
  const serviceKey = String(process.env.INTERNAL_API_KEY || "").trim();
  if (!target || !serviceKey) return NextResponse.json({ ok: false, error: "INQUIRY_CAPTURE_UNAVAILABLE" }, { status: 503 });
  const visitor = visitorToken(request, serviceKey);
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "INQUIRY_PAYLOAD_INVALID" }, { status: 400 }); }
  try {
    const response = await fetch(`${target}/api/staffordos/automation-inquiries`, {
      method: "POST", headers: { "content-type": "application/json", "x-internal-api-key": serviceKey, "x-stafford-visitor-token": visitor.token, accept: "application/json" },
      body: JSON.stringify(body), signal: AbortSignal.timeout(5000), cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const output = NextResponse.json({ ok: false, error: response.status === 409 ? "INQUIRY_IDEMPOTENCY_CONFLICT" : response.status === 429 ? "INQUIRY_RATE_LIMITED" : "INQUIRY_CAPTURE_UNAVAILABLE" }, { status: response.status === 409 || response.status === 429 ? response.status : 502 });
      if (response.status === 429) output.headers.set("Retry-After", response.headers.get("Retry-After") || "900");
      return output;
    }
    const output = NextResponse.json({ ok: true, inquiryId: result.inquiryId, status: result.status });
    if (visitor.fresh) output.cookies.set("stafford_visitor", visitor.token, { httpOnly: true, sameSite: "lax", secure: request.url.startsWith("https:"), maxAge: 86400, path: "/" });
    return output;
  } catch {
    return NextResponse.json({ ok: false, error: "INQUIRY_CAPTURE_UNAVAILABLE" }, { status: 503 });
  }
}
