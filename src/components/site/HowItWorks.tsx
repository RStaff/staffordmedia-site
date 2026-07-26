const steps = [
  "Submit your store",
  "Get a real audit with your top issue",
  "See the next fix worth testing",
  "Activate recovery once the path is clear",
];

export default function HowItWorks() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="max-w-3xl">
          <p className="eyebrow text-slate-400">How it works</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">From audit to revenue — in one flow.</h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step} className="premium-panel-soft p-6">
              <p className="text-sm font-semibold tracking-[0.2em] text-[var(--smc-accent)]">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-5 text-lg font-semibold text-white">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
