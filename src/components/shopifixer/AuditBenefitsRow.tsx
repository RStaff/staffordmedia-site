export default function AuditBenefitsRow() {
  return (
    <section className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
        How it works
      </p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        Diagnose the issue. Fix the blocker. Recover the revenue.
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
        ShopiFixer identifies the clearest conversion issue, Stafford Media implements the highest-impact
        fix, and Abando helps recover more revenue automatically after the problem is resolved.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Diagnose</p>
          <h3 className="mt-2 text-sm font-semibold text-white">ShopiFixer audit</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            See the clearest issue, estimated 30-day upside, and the first move worth testing.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Fix</p>
          <h3 className="mt-2 text-sm font-semibold text-white">Stafford Media implementation</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Get the highest-priority fix implemented for you without a retainer or guesswork.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recover</p>
          <h3 className="mt-2 text-sm font-semibold text-white">Abando automation</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Recover more revenue automatically from shoppers who still leave after the fix.
          </p>
        </div>
      </div>
    </section>
  );
}
