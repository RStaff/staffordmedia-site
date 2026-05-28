import Link from "next/link";
import AbandoTitle from "../AbandoTitle";

export default function ProductSplit() {
  return (
    <section className="section-pad">
      <div className="site-shell grid gap-6 md:grid-cols-2">
        <article id="shopifixer" className="premium-panel-soft p-6 md:p-8">
          <p className="eyebrow text-[var(--smc-shopifixer-green)]">Service-led audit</p>

          <div className="mt-8 max-w-[300px] rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-xl shadow-black/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Sample Audit Output
            </p>

            <p className="mt-1 text-xs font-semibold text-[var(--smc-shopifixer-green)]">
              Revenue leak detected
            </p>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
              <p className="text-[11px] text-slate-400">Checkout drop-off</p>
              <p className="text-xl font-semibold text-white">42%</p>
            </div>

            <div className="mt-3 space-y-2 text-[11px]">
              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Issue</span>
                <span className="text-right text-white">Shipping friction</span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Fix</span>
                <span className="text-right text-white">Simplify tiers</span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-slate-400">Scope</span>
                <span className="text-[var(--smc-accent)]">Review first</span>
              </div>
            </div>
          </div>

          <h2 className="mt-10 text-3xl font-semibold text-white">
            ShopiFixer
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            Know exactly what’s costing you revenue — in minutes.
          </p>

          <p className="mt-4 text-slate-400">
            ShopiFixer analyzes your store and shows you the single issue most likely to increase your conversions right now — so you can fix the right thing first.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <p>• Identify where customers drop off in your funnel</p>
            <p>• Get a clear, actionable fix — not a list of guesses</p>
            <p>• See the potential lift before you make changes</p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            Most stores don’t need more traffic. They need the right problem solved first.
          </div>

          <Link
            href="/shopifixer"
            className="mt-8 inline-flex rounded-xl bg-[var(--smc-accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Run My Free Audit
          </Link>
        </article>

        <article id="abando" className="premium-panel-soft p-6 md:p-8">
          <p className="eyebrow text-slate-400">Recovery product</p>

          <div className="mt-6">
            <AbandoTitle />
          </div>

          <h2 className="mt-6 text-3xl font-semibold text-white">
            Abando
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            Bring shoppers back after they leave — and prove what revenue was recovered.
          </p>

          <p className="mt-4 text-slate-400">
            Abando is standalone recovery infrastructure. It also complements ShopiFixer when diagnosis, implementation,
            and recovery are used together as one commerce loop.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <p>• Send recovery messages after buying intent is detected</p>
            <p>• Track when shoppers return after the message</p>
            <p>• Connect recovered sales back to the recovery path</p>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            Independent product. Complementary recovery layer.
          </div>

          <Link href="/recovery-demo" className="mt-8 inline-flex rounded-xl border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-violet-300 hover:text-violet-200">
            See Abando Recovery Proof
          </Link>
        </article>
      </div>
    </section>
  );
}
