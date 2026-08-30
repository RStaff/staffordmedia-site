import Image from "next/image";
import Link from "next/link";

const trustChips = ["AI automation", "Business technology", "Human-reviewed work"];

export default function HomeHero() {
  return (
    <section className="section-pad">
      <div className="site-shell grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)] lg:items-center">
        <div className="hero-copy-max">
          <p className="eyebrow text-[var(--smc-accent)]">Stafford Media Consulting</p>

          <h1 className="hero-title mt-5 text-white">
            Improve the work that keeps your business moving.
          </h1>

          <p className="body-lg mt-6">
            We help businesses identify, improve, and automate real workflows with practical technology, appropriate AI, and human oversight.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/services" className="smc-button smc-button-primary">
              Automate My Business
            </Link>
            <Link href="/contact" className="smc-button smc-button-secondary">
              Book Strategy Call
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {trustChips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-panel p-6 md:p-7">
          <div>
            <p className="eyebrow text-slate-400">How we work</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
              Start with the problem. Build the right next step.
            </h2>
          </div>

          <div className="mt-7 grid gap-3">
            <div className="premium-panel-soft p-4">
              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0 max-w-[360px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-shopifixer-green)]">1. Understand</p>
                  <p className="mt-3 text-lg font-semibold text-white">Make the workflow visible</p>
                  <p className="body-md mt-2">Clarify where time, handoffs, or follow-up are getting lost.</p>
                </div>
                <div className="flex h-24 w-64 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden">
                  <Image
                    src="/brand/no_padding_shopifixer_logo.png"
                    alt="ShopiFixer"
                    width={280}
                    height={140}
                    className="h-24 w-auto scale-110"
                  />
                </div>
              </div>
            </div>

            <div className="premium-panel-soft p-4">
              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0 max-w-[360px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-accent)]">2. Improve</p>
                  <p className="mt-3 text-lg font-semibold text-white">Choose a useful next step</p>
                  <p className="body-md mt-2">Shape a focused improvement around the way your team actually works.</p>
                </div>
                <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 p-2">
                  <Image
                    src="/brand/smc-logo.inline.png"
                    alt="Stafford Media Consulting"
                    width={72}
                    height={72}
                    className="h-10 w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="premium-panel-soft p-4">
              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0 max-w-[360px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-shopifixer-violet)]">3. Automate</p>
                  <p className="mt-3 text-lg font-semibold text-white">Support repeatable work</p>
                  <p className="body-md mt-2">Use software and AI where they can reduce avoidable manual effort.</p>
                </div>
                <div className="flex h-14 w-36 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                  <Image
                    src="/brand/abando-logo-transparent.png"
                    alt="Abando"
                    width={44}
                    height={44}
                    className="h-7 w-7"
                  />
                  <span className="text-lg font-semibold text-white">Abando</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
