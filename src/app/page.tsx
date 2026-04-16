import Link from "next/link";
import Image from "next/image";
import AbandoTitle from "@/components/AbandoTitle";
import ShopifixerLogo from "@/components/ShopifixerLogo";

const steps = [
  {
    number: "01",
    title: "Diagnose with ShopiFixer",
    body: "Start with a service-led audit built to surface the clearest conversion issue first, not a vague list of possibilities.",
  },
  {
    number: "02",
    title: "Fix the strongest issue",
    body: "Use the audit evidence to focus on the next fix with the highest leverage instead of redesigning blindly.",
  },
  {
    number: "03",
    title: "Recover with Abando",
    body: "Once the issue is clear, add a recovery system that keeps working across the hesitant shoppers who still leave.",
  },
];

const confidencePoints = [
  "Engine-backed audit outputs tied to the same live result flow.",
  "Example store reviews grounded in real audit paths, not static demo slides.",
  "Service-led diagnosis first, then a systemized recovery path if scaling makes sense.",
];

export default function HomePage() {
  return (
    <main>
      <section className="section-pad">
        <div className="site-shell grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-center">
          <div className="hero-copy-max">
            <p className="eyebrow text-[var(--smc-accent)]">Stafford Media Consulting</p>
            <h1 className="hero-title mt-5 text-white">Find the leak. Fix the issue. Recover the revenue.</h1>
            <p className="body-lg mt-6">
              ShopiFixer gives you the clearest service-led audit. Abando gives you the recovery system that keeps
              working after the diagnosis.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/shopifixer" className="smc-button smc-button-primary">
                Run ShopiFixer Audit
              </Link>
              <Link href="/contact" className="smc-button smc-button-secondary">
                Book Strategy Call
              </Link>
            </div>
          </div>

          <div className="premium-panel p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <Image
                  src="/brand/smc.png"
                  alt="Stafford Media Consulting"
                  width={64}
                  height={64}
                  className="h-12 w-auto"
                />
              </div>
              <div>
                <p className="eyebrow text-slate-400">Operating model</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">One commercial system</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="premium-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-shopifixer-green)]">
                  1. ShopiFixer audit
                </p>
                <p className="mt-3 text-lg font-semibold text-white">Surface the strongest issue first.</p>
                <p className="body-md mt-2">
                  Start with evidence-backed diagnosis so the next move is clear before you change anything.
                </p>
              </div>
              <div className="premium-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-accent)]">
                  2. Fix the clearest issue
                </p>
                <p className="mt-3 text-lg font-semibold text-white">Make the next fix obvious.</p>
                <p className="body-md mt-2">
                  Use the audit read to prioritize the one issue most likely to be suppressing conversion.
                </p>
              </div>
              <div className="premium-panel-soft p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-shopifixer-violet)]">
                  3. Abando recovery system
                </p>
                <p className="mt-3 text-lg font-semibold text-white">Recover revenue automatically after diagnosis.</p>
                <p className="body-md mt-2">
                  Add the productized recovery layer once the diagnosis is clear and the commercial path is worth scaling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="site-shell">
          <div className="offer-grid">
            <article className="premium-panel p-6 md:p-8">
              <p className="eyebrow text-[var(--smc-shopifixer-green)]">Service-led audit</p>
              <div className="mt-6">
                <ShopifixerLogo className="h-auto w-full max-w-[260px]" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">ShopiFixer</h2>
              <p className="body-md mt-4">
                A fast audit-style review designed to surface the clearest issue first, show the evidence behind it,
                and point to the next fix worth testing.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                <li>Strongest issue first, not a scattered list.</li>
                <li>Evidence-backed read with clear next action.</li>
                <li>Built to help operators move faster without redesigning blindly.</li>
              </ul>
              <div className="mt-8">
                <Link href="/shopifixer" className="smc-button smc-button-primary">
                  Run Audit
                </Link>
              </div>
            </article>

            <article id="abando" className="premium-panel-soft p-6 md:p-8">
              <p className="eyebrow text-slate-400">Recovery product</p>
              <div className="mt-6">
                <AbandoTitle />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">Abando</h2>
              <p className="body-md mt-4">
                A productized recovery system that follows the audit, helping you recover more revenue across the
                shoppers who still hesitate, abandon, or leave after the diagnosis.
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                <li>Built to continue after the diagnosis phase.</li>
                <li>Designed to increase conversion without redesign-led disruption.</li>
                <li>Best framed as the scale path after the issue is clear.</li>
              </ul>
              <div className="mt-8">
                <Link href="/services" className="smc-button smc-button-secondary">
                  See Recovery System
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="site-shell">
          <div className="max-w-3xl">
            <p className="eyebrow text-slate-400">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">A clearer path from audit to recovery.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="premium-panel-soft p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-[var(--smc-accent)]">{step.number}</p>
                <h3 className="mt-5 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="body-md mt-4">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="site-shell">
          <div className="premium-panel p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
              <div>
                <p className="eyebrow text-slate-400">Proof and confidence</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                  Built around real audit output, not decorative positioning.
                </h2>
                <p className="body-md mt-5">
                  The system is designed around engine-backed audit output and real example store reviews. The point is
                  to create confidence through clearer diagnosis and a cleaner next step, not through fake claims.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="premium-panel-soft p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Example store context</p>
                  <p className="mt-3 text-base leading-7 text-slate-200">
                    Example audit paths already in use include stores like <span className="font-semibold text-white">elkeyecoffee.com</span> and{" "}
                    <span className="font-semibold text-white">luckettstore.com</span>.
                  </p>
                </div>
                <div className="premium-panel-soft p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Why this matters</p>
                  <ul className="mt-3 space-y-3 text-base leading-7 text-slate-200">
                    {confidencePoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="site-shell">
          <div className="premium-panel p-6 text-center md:p-10">
            <p className="eyebrow text-[var(--smc-accent)]">Next step</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
              Start with the audit. Then decide how far to scale.
            </h2>
            <p className="body-md mx-auto mt-5 max-w-2xl">
              Use ShopiFixer to get the clearest read on the issue first. If the path is worth pushing further, Abando
              is there as the recovery system that follows.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/shopifixer" className="smc-button smc-button-primary">
                Run ShopiFixer Audit
              </Link>
              <Link href="/contact" className="smc-button smc-button-secondary">
                Book Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
