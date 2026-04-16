export default function AuditReadPreview() {
  return (
    <div className="premium-panel-soft p-6">
      <p className="eyebrow text-slate-400">What the read should do</p>
      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-sm font-semibold text-white">Evidence-backed issue framing</p>
          <p className="body-md mt-2">
            The goal is not to generate noise. It is to isolate the clearest issue and explain why it matters.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-sm font-semibold text-white">Commercially useful next step</p>
          <p className="body-md mt-2">
            Once the strongest issue is clear, the first fix becomes easier to prioritize and test.
          </p>
        </div>
      </div>
    </div>
  );
}
