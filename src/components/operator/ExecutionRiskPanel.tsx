import ExecutionReviewCard, { ReviewBadge, ReviewField } from "./ExecutionReviewCard";

export type ExecutionRiskPanelData = {
  riskLevel: string;
  replayable: boolean;
  rollbackRequired: boolean;
  rollbackReady: boolean;
  mutationDepth: string;
  compatibility: Array<{ label: string; valid: boolean }>;
  rollbackReference?: string;
};

export default function ExecutionRiskPanel({ risk }: { risk: ExecutionRiskPanelData }) {
  return (
    <ExecutionReviewCard title="Risk, Rollback, Replayability" eyebrow="Safety gates">
      <div className="flex flex-wrap gap-2">
        <ReviewBadge value={risk.riskLevel} />
        <ReviewBadge value={`mutation ${risk.mutationDepth}`} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ReviewField label="Replayable" value={<ReviewBadge value={risk.replayable} />} />
        <ReviewField label="Rollback required" value={<ReviewBadge value={risk.rollbackRequired} />} />
        <ReviewField label="Rollback ready" value={<ReviewBadge value={risk.rollbackReady} />} />
      </div>
      <ReviewField label="Rollback reference" value={risk.rollbackReference || "Not attached"} />
      <div className="grid gap-2">
        {risk.compatibility.map((check) => (
          <div key={check.label} className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-900/45 p-3">
            <span className="text-sm text-slate-300">{check.label}</span>
            <ReviewBadge value={check.valid} />
          </div>
        ))}
      </div>
    </ExecutionReviewCard>
  );
}

