import Link from "next/link";

const painPoints = [
  "High add-to-cart, low checkout completion",
  "Drop-offs during shipping or pricing steps",
  "Returning visitors who never convert",
  "No clear signal on what to fix first",
];

export default function PainSection() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="premium-panel p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="eyebrow text-slate-400">The problem</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Most stores do not need more guesses. They need the clearest revenue leak fixed first.
              </h2>
              <p className="body-md mt-5">
                Your store may already have enough traffic. The fastest win is finding where buying intent breaks down.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {painPoints.map((item) => (
                <div key={item} className="premium-panel-soft p-5">
                  <p className="text-base leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Link href="/shopifixer" className="smc-button smc-button-primary">
              Find My Revenue Leak
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
