import type { EvidenceObservation as EvidenceObservationModel } from "@/lib/evidence/evidencePacket";
import { canonicalIssueDefinitions } from "@/lib/evidence/operationalTopology";

const severityStyles = {
  attention: "border-amber-400/25 bg-amber-950/15 text-amber-100",
  review: "border-cyan-400/25 bg-cyan-950/15 text-cyan-100",
  blocked: "border-red-400/25 bg-red-950/15 text-red-100",
};

const severityLabels = {
  attention: "Focus area",
  review: "Needs review",
  blocked: "Needs review",
};

export default function EvidenceObservation({
  observation,
}: {
  observation: EvidenceObservationModel;
}) {
  const issueDefinition = canonicalIssueDefinitions[observation.issue_id];

  return (
    <div className={`rounded-2xl border p-4 ${severityStyles[observation.severity]}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{observation.title}</p>
        <span className="rounded-full border border-current/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
          {observation.unresolved ? "Review note" : "Evidence note"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{observation.observation}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-current/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {observation.issue_id}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{severityLabels[observation.severity]}</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{issueDefinition.label}</p>
    </div>
  );
}
