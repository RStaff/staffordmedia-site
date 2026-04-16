import Image from "next/image";
import Link from "next/link";

const trustChips = ["Used by Shopify operators", "Audit in minutes", "No redesign required"];

export default function HomeHero() {
  return (
    <section className="section-pad">
      <div className="site-shell grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-center">
        <div className="hero-copy-max">
          <p className="eyebrow text-[var(--smc-accent)]">Stafford Media Consulting</p>
          <h1 className="hero-title mt-5 text-white">
            Find where your store is losing revenue — and recover it automatically.
          </h1>
          <p className="body-lg mt-6">
            Run a real audit of your store. See the exact issue holding back conversion. Then activate a system that
            recovers lost revenue without redesigning everything.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shopifixer" className="smc-button smc-button-primary">
              Run ShopiFixer Audit
            </Link>
            <Link href="/contact" className="smc-button smc-button-secondary">
              Book Strategy Call
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {trustChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-panel p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <Image
                src="/brand/smc-logo.inline.png"
                alt="Stafford Media Consulting"
                width={64}
                height={64}
                className="h-12 w-auto"
              />
            </div>
            <div>
              <p className="eyebrow text-slate-400">Commercial system</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Audit to recovery in one path</h2>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="premium-panel-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-shopifixer-green)]">
                1. ShopiFixer audit
              </p>
              <p className="mt-3 text-lg font-semibold text-white">See the clearest issue first.</p>
              <p className="body-md mt-2">Start with a real audit read so the strongest problem is obvious before you change anything.</p>
            </div>
            <div className="premium-panel-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-accent)]">
                2. Fix the issue
              </p>
              <p className="mt-3 text-lg font-semibold text-white">Focus the next move.</p>
              <p className="body-md mt-2">Use the diagnosis to concentrate on the one change most likely to move revenue.</p>
            </div>
            <div className="premium-panel-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--smc-shopifixer-violet)]">
                3. Abando recovery
              </p>
              <p className="mt-3 text-lg font-semibold text-white">Recover what still gets left behind.</p>
              <p className="body-md mt-2">
                Add the recovery system once the path is clear so revenue keeps getting pulled back without a redesign cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
