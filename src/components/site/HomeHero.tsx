import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="section-pad">
      <div className="site-shell grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-center">

        {/* LEFT */}
        <div>
          <h1 className="hero-title text-white">
            You’re likely losing $3K–$7K/month from a fixable issue on your storefront.
          </h1>

          <p className="mt-4 text-lg text-slate-300">
            We identify where customers drop off, fix it, and recover lost revenue automatically.
          </p>

          <div className="mt-6 flex gap-4">
            <Link href="/shopifixer" className="smc-button smc-button-primary">
              Find My Revenue Leak
            </Link>
            <Link href="/contact" className="smc-button smc-button-secondary">
              Book Strategy Call
            </Link>
          </div>

          {/* CLEAN SHOPIFY BADGE */}
          <div className="mt-4">
            <img
              src="/brand/shopify_partner-logo-white.png"
              alt="Shopify Partner"
              className="h-7 w-auto"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="premium-panel p-6">
          <h2 className="text-xl font-semibold text-white">
            We find it. We fix it. Then we scale it.
          </h2>

          <div className="mt-6 space-y-3 text-slate-300">
            <p>1. Diagnose the revenue leak</p>
            <p>2. Fix the highest-impact issue</p>
            <p>3. Recover lost revenue automatically</p>
          </div>
        </div>

      </div>
    </section>
  );
}
