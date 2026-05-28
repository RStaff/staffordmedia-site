import Link from "next/link";
import { lookupPacket, packetHref, type MinimumLifecycleState } from "@/lib/minimumStateContinuity";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";

export const metadata = {
  title: "Fix Status - Stafford Media Consulting",
  description: "ShopiFixer fulfillment state continuity.",
};

type PageProps = {
  searchParams?: Promise<{ store?: string; state?: string; packet?: string }>;
};

function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function stateCopy(state: MinimumLifecycleState | "packet_missing") {
  switch (state) {
    case "payment_verified":
    case "intake_pending":
      return {
        label: "Intake pending",
        headline: "Your fix request is open.",
        body: "Intake details come first.",
      };
    case "intake_started":
      return {
        label: "Intake open",
        headline: "Your intake is open.",
        body: "Store, access, approval contact, and audit context are confirmed before implementation work begins.",
      };
    case "awaiting_review":
      return {
        label: "Awaiting approval",
        headline: "Your review is ready for approval.",
        body: "You approve before anything launches.",
      };
    case "implementation_in_progress":
      return {
        label: "Controlled deployment",
        headline: "Approved implementation work is active.",
        body: "Visible updates remain approval-bound before completion.",
      };
    case "proof_ready":
      return {
        label: "Evidence ready",
        headline: "Before-and-after review is ready.",
        body: "Review the updated buying path before completion.",
      };
    case "unresolved":
      return {
        label: "Reviewing",
        headline: "We’re reviewing the next step.",
        body: "The next action needs confirmation.",
      };
    case "complete":
      return {
        label: "Complete",
        headline: "Your storefront review is complete.",
        body: "Confirm the work and any final notes.",
      };
    case "reverted":
      return {
        label: "Reviewing",
        headline: "We’re reviewing the restored state.",
        body: "The original storefront path stays accountable.",
      };
    default:
      return {
        label: "Request unavailable",
        headline: "We need to link your request.",
        body: "Use the payment or intake link tied to this store.",
      };
  }
}

function withStore(path: string, store: string) {
  return store ? `${path}?store=${encodeURIComponent(store)}` : path;
}

function publicProofLabel(value?: string) {
  if (value === "ready" || value === "delivered") return "Proof ready";
  if (value === "blocked") return "Review needed";
  return "Not available yet";
}

export default async function FixStatusPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const packetResult = await lookupPacket({ packetId: params.packet || "", store });
  const packet = packetResult.status === "found" ? packetResult.packet : null;
  const state = packet ? packet.current_lifecycle_state : "packet_missing";
  const copy = stateCopy(state);
  const proofAvailable = packet?.proof_state === "ready" || packet?.proof_state === "delivered";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="approve" stateLabel={copy.label} className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: packet ? copy.label : "Request unavailable." },
          { label: "Next", value: "Open the next safe step." },
          { label: "Safe", value: "You approve before launch." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Fix Status</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {copy.headline}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{copy.body}</p>
            </div>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-950/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
              {copy.label}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{packet?.store_url || store || "Store confirmation required"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Review</p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {publicProofLabel(packet?.proof_state)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Next action</p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {packet ? "Open the next step." : "Use the store-specific link."}
              </p>
            </div>
          </div>
        </section>

        <details className="border-y border-slate-800/70 py-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Safeguards
          </summary>
          <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Review discipline</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">The review stays connected while the experience stays simple.</p>
            {params.state && !packet ? (
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Your fix request is not linked to this view.
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Protection</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Scope, access, review, and completion stay approval-bound.
            </p>
          </div>
          </div>
        </details>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Continue</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Open the next step.</h2>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={
                proofAvailable
                  ? packet
                    ? packetHref("/fix-proof", packet)
                    : withStore("/fix-proof", store)
                  : packet
                    ? packetHref("/fix-review", packet)
                    : withStore("/fix-review", store)
              }
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {proofAvailable ? "Open Proof Review" : "Return to Approval Review"}
            </Link>
            <Link
              href={packet ? packetHref("/fix-review", packet) : withStore("/fix-review", store)}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to Fix Review
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
