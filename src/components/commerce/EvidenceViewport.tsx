import type { EvidencePacket, EvidenceSurface } from "@/lib/evidence/evidencePacket";
import { buildOperationalTopology } from "@/lib/evidence/operationalTopology";
import EvidenceObservation from "@/components/commerce/EvidenceObservation";
import EvidenceImageFrame from "@/components/commerce/EvidenceImageFrame";

const stateLabels: Record<EvidencePacket["evidence_state"], string> = {
  captured: "Review attached",
  awaiting_review: "Reviewing",
  approved: "Validated",
  revision_requested: "Revision requested",
  deferred: "Preparing",
};

const stateStyles: Record<EvidencePacket["evidence_state"], string> = {
  captured: "border-cyan-400/30 bg-cyan-950/20 text-cyan-100",
  awaiting_review: "border-amber-400/30 bg-amber-950/20 text-amber-100",
  approved: "border-emerald-400/30 bg-emerald-950/20 text-emerald-100",
  revision_requested: "border-red-400/30 bg-red-950/20 text-red-100",
  deferred: "border-slate-700 bg-slate-900 text-slate-200",
};

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function EvidenceOverlay({ observation, index }: { observation: EvidenceSurface["observations"][number]; index: number }) {
  if (!observation.bounds) return null;

  const { x, y, width, height } = observation.bounds;
  return (
    <div
      className="absolute rounded-2xl border-2 border-amber-300/80 bg-amber-300/10 shadow-[0_0_0_9999px_rgba(2,6,23,0.28)]"
      style={{
        left: `${clampPercent(x)}%`,
        top: `${clampPercent(y)}%`,
        width: `${clampPercent(width)}%`,
        height: `${clampPercent(height)}%`,
      }}
    >
      <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-amber-200 bg-slate-950 text-xs font-semibold text-amber-100 shadow-lg shadow-black/30">
        {index + 1}
      </span>
    </div>
  );
}

export default function EvidenceViewport({
  packet,
  surface,
  title,
  copy,
  dimContext = true,
  showState = true,
}: {
  packet: EvidencePacket;
  surface: EvidenceSurface;
  title: string;
  copy: string;
  dimContext?: boolean;
  showState?: boolean;
}) {
  const isMobile = surface.viewport === "mobile";
  const topology = buildOperationalTopology(packet, packet.product_boundary);
  const surfaceIssueIds = surface.observations.map((observation) => observation.issue_id);

  return (
    <section className="rounded-3xl border border-slate-800/75 bg-slate-900/45 p-5 shadow-lg shadow-black/5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Evidence</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{copy}</p>
        </div>
        {showState ? (
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${stateStyles[packet.evidence_state]}`}>
            {stateLabels[packet.evidence_state]}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className={isMobile ? "mx-auto w-full max-w-[360px]" : "w-full"}>
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/75 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3">
              <span className="min-w-0 truncate text-xs font-semibold text-slate-300">{packet.store}</span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                {surface.viewport} / {surface.type}
              </span>
            </div>
            <EvidenceImageFrame
              imageUrl={surface.image_url}
              ariaLabel={`${packet.store} ${surface.viewport} ${surface.type} evidence`}
              className={`relative bg-slate-950 bg-contain bg-top bg-no-repeat ${
                isMobile ? "aspect-[9/16] min-h-[520px]" : "aspect-[16/10] min-h-[320px]"
              } ${dimContext ? "opacity-80" : "opacity-95"}`}
              fallbackTitle="Storefront screenshot is not available yet."
              fallbackCopy="The evidence notes remain available. Screenshot review will stay tied to this store."
            >
              <p className="absolute bottom-4 right-4 max-w-xs rounded-full border border-slate-800 bg-slate-950/85 px-3 py-1.5 text-[11px] font-medium text-slate-400">
                Storefront evidence review.
              </p>
              {surface.observations.map((observation, index) => (
                <EvidenceOverlay key={observation.id} observation={observation} index={index} />
              ))}
            </EvidenceImageFrame>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border-l border-slate-800 pl-4">
            <p className="mt-2 text-sm font-medium text-slate-100">{packet.store}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">Evidence package open.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {surfaceIssueIds.map((issueId) => (
                <span key={issueId} className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {issueId}
                </span>
              ))}
            </div>
            {topology.unresolved_continuity.length > 0 ? (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {topology.unresolved_continuity.length} note{topology.unresolved_continuity.length === 1 ? "" : "s"} visible.
              </p>
            ) : null}
          </div>
          {surface.observations.map((observation) => (
            <EvidenceObservation key={observation.id} observation={observation} />
          ))}
        </div>
      </div>
    </section>
  );
}
