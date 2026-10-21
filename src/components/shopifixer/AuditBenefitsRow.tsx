export default function AuditBenefitsRow() {
  return (
    <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/55 p-5 shadow-lg shadow-black/10 md:mb-10 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
        How it works
      </p>

      <h2 className="mt-3 text-xl font-semibold tracking-tight text-white md:text-2xl">
        Diagnose the issue. Review the fix. Move forward safely.
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Diagnose</p>
          <h3 className="mt-2 text-sm font-semibold text-white">ShopiFixer audit</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Find where buyer momentum weakens.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Fix</p>
          <h3 className="mt-2 text-sm font-semibold text-white">Stafford Media implementation</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">One scoped improvement, reviewed first.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recover</p>
          <h3 className="mt-2 text-sm font-semibold text-white">Abando recovery</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Optional recovery after the path is clearer.</p>
        </div>
      </div>
    </section>
  );
}
