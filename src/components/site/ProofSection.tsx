const proofBullets = [
  "Work starts with the actual process, not a generic technology pitch.",
  "Scope stays focused so the next step can be reviewed clearly.",
  "Existing product paths remain distinct within the broader portfolio.",
];

export default function ProofSection() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="premium-panel p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div>
              <p className="eyebrow text-slate-400">Proof</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Practical systems work, grounded in the problem.</h2>
              <p className="body-md mt-5">
                The right solution depends on the workflow, the people involved, and the constraints of the business. We keep that context visible before choosing a technology path.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="premium-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Portfolio products</p>
                <p className="mt-3 text-base leading-7 text-slate-200">
                  StaffordNext · ShopiFixer · Abando.ai
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
