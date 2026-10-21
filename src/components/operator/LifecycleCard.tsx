type LifecycleCardProps = {
  merchantId: string;
  storeDomain: string;
  lifecycleState: string;
  riskLevel: string;
  rollbackReady: boolean;
  replayable: boolean;
  mutationDepth: string;
  approvalState: string;
  runtimeOwner: string;
  latestEventSummary?: string;
};

function statusClasses(value: string | boolean) {
  if (value === true) return "border-emerald-500/25 bg-emerald-950/35 text-emerald-200";
  if (value === false) return "border-amber-500/25 bg-amber-950/35 text-amber-200";

  const normalized = value.toUpperCase();
  if (["APPROVED", "READY", "READY_FOR_MANUAL_EXECUTION", "QUALIFIED", "AUDIT_GENERATED"].includes(normalized)) {
    return "border-emerald-500/25 bg-emerald-950/35 text-emerald-200";
  }
  if (["BLOCKED", "REJECTED", "HIGH", "DRIFT_RISK"].includes(normalized)) {
    return "border-rose-500/25 bg-rose-950/35 text-rose-200";
  }
  if (["UNKNOWN", "APPROVAL_PENDING", "NOT_REQUESTED", "QA_PENDING", "LEAD_CAPTURED"].includes(normalized)) {
    return "border-amber-500/25 bg-amber-950/35 text-amber-200";
  }
  return "border-slate-700 bg-slate-900 text-slate-300";
}

function Badge({ value }: { value: string | boolean }) {
  const label = typeof value === "boolean" ? (value ? "yes" : "no") : value;
  return <span className={`inline-flex rounded border px-1.5 py-0.5 text-[11px] font-semibold ${statusClasses(value)}`}>{label}</span>;
}

function Field({ label, value }: { label: string; value: string | boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-1 break-words text-xs text-slate-200">{typeof value === "boolean" ? <Badge value={value} /> : value}</div>
    </div>
  );
}

export default function LifecycleCard({
  merchantId,
  storeDomain,
  lifecycleState,
  riskLevel,
  rollbackReady,
  replayable,
  mutationDepth,
  approvalState,
  runtimeOwner,
  latestEventSummary,
}: LifecycleCardProps) {
  return (
    <article className="rounded-md border border-slate-800 bg-slate-950/70 p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge value={lifecycleState} />
        <Badge value={approvalState} />
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="break-words text-sm font-semibold text-white">{merchantId}</h3>
        <p className="mt-1 break-words text-xs text-slate-400">{storeDomain}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <Field label="Risk" value={riskLevel} />
        <Field label="Rollback ready" value={rollbackReady} />
        <Field label="Replayable" value={replayable} />
        <Field label="Mutation depth" value={mutationDepth} />
        <Field label="Runtime owner" value={runtimeOwner} />
      </div>

      {latestEventSummary ? (
        <div className="mt-4 rounded border border-slate-800 bg-slate-900/60 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Latest event</p>
          <p className="mt-1 break-words text-xs leading-5 text-slate-300">{latestEventSummary}</p>
        </div>
      ) : null}
    </article>
  );
}

