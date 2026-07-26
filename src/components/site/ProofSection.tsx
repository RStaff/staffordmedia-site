const proofBullets = [
  "Engine-backed audit outputs tied to the same live result flow.",
  "Real example store paths, not static deck language.",
  "Separate diagnosis, implementation, and recovery proof boundaries.",
];

export default function ProofSection() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="premium-panel p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div>
              <p className="eyebrow text-slate-400">Proof</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Built on real audit outputs — not theory.</h2>
              <p className="body-md mt-5">
                This system is grounded in real store audits and real conversion paths. The goal is to isolate the
                clearest issue and show the next move.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="premium-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Example stores</p>
                <p className="mt-3 text-base leading-7 text-slate-200">
                  elkeyecoffee.com · luckettstore.com · dripaccessory.com
                </p>
              </div>
              <div className="premium-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Why it matters</p>
                <ul className="mt-3 space-y-3 text-base leading-7 text-slate-200">
                  {proofBullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
