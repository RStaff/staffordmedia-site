import Link from "next/link";
import AbandoTitle from "@/components/AbandoTitle";
import ShopifixerLogo from "@/components/ShopifixerLogo";

export default function ProductSplit() {
  return (
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
              A fast, audit-style review designed to surface the strongest issue first, show the evidence behind it,
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
              A recovery system that follows the audit — helping you convert the shoppers who hesitate, abandon, or
              leave before purchase.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
              <li>Built to continue after the diagnosis phase.</li>
              <li>Designed to increase conversion without redesign-led disruption.</li>
              <li>Best framed as the scale path after the issue is clear.</li>
            </ul>
            <div className="mt-8">
              <Link href="/recovery-demo" className="smc-button smc-button-secondary">
                See Abando Recovery Demo
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
