import Link from "next/link";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import {
  buildContinuityHref,
  cleanStoreDomain,
  displayPacketReference,
  getFixStatusCopy,
  merchantNextActionForResult,
  packetUpdatedAt,
  publicProofLabel,
  validateFixStatusRequest,
} from "@/lib/fixStatusPacketAuthority";

export const metadata = {
  title: "Fix Status - Stafford Media Consulting",
  description: "ShopiFixer fulfillment state continuity.",
};

type PageProps = {
  searchParams?: Promise<{
    store?: string;
    state?: string;
    packet?: string;
    packet_id?: string;
    session_id?: string;
    reservation_id?: string;
  }>;
};

function withStore(path: string, store: string) {
  return store ? `${path}?store=${encodeURIComponent(store)}` : path;
}

export default async function FixStatusPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const result = await validateFixStatusRequest(params);
  const packet = result.packet;
  const copy = getFixStatusCopy(result.state);
  const resolvedStore = packet ? cleanStoreDomain(packet.store_domain || packet.store_url || "") : "";
  const proofAvailable = result.state === "PROOF_READY" || result.state === "COMPLETED";
  const canOpenNextStep = Boolean(packet && result.state !== "UNPAID" && result.state !== "STATUS_REVIEW");
  const primaryHref = proofAvailable
    ? buildContinuityHref("/fix-proof", result)
    : canOpenNextStep
      ? buildContinuityHref("/fix-review", result)
      : resolvedStore
        ? withStore("/pricing", resolvedStore)
        : "/shopifixer";
  const secondaryHref = packet ? buildContinuityHref("/fix-review", result) : "/shopifixer";
  const lastUpdated = packetUpdatedAt(packet);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="approve" stateLabel={copy.label} className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: copy.label },
          { label: "Next", value: merchantNextActionForResult(result) },
          { label: "Safe", value: "Status is verified first." },
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
              <p className="mt-2 text-sm font-medium text-slate-100">{resolvedStore || "Not verified"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Review</p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {publicProofLabel(packet)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Reference</p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {displayPacketReference(packet)}
              </p>
            </div>
          </div>
          {lastUpdated ? (
            <p className="mt-4 text-xs text-slate-500">
              Last status update: {lastUpdated}
            </p>
          ) : null}
        </section>

        <details className="border-y border-slate-800/70 py-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Safeguards
          </summary>
          <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Review discipline</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">The review stays connected while the experience stays simple.</p>
            {!packet ? (
              <p className="mt-4 text-sm leading-7 text-slate-300">
                This view does not show request progress until the link is verified.
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
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{merchantNextActionForResult(result)}</h2>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={primaryHref}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {proofAvailable ? "Open Proof Review" : canOpenNextStep ? "Open Approval Review" : "Return to ShopiFixer"}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              {packet ? "Back to Fix Review" : "Start Over"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
