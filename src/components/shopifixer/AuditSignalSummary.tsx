export default function AuditSignalSummary() {
  return (
    <div className="premium-panel-soft p-5 md:p-6">
      <p className="eyebrow text-slate-400">Signal summary</p>
      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-4">
          <p className="text-sm font-semibold text-white">The clearest issue</p>
          <p className="body-md mt-2">Where buyer attention starts to drift.</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-4">
          <p className="text-sm font-semibold text-white">A focused next step</p>
          <p className="body-md mt-2">A focused path to review before launch.</p>
        </div>
      </div>
    </div>
  );
}
