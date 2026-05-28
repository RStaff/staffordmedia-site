import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="premium-panel p-6 text-center md:p-10">
          <p className="eyebrow text-[var(--smc-accent)]">Next step</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Start with the audit. Then decide how far to scale.
          </h2>
          <p className="body-md mx-auto mt-5 max-w-2xl">
            Use ShopiFixer to get the clearest read on your store. Use Abando independently for recovery, or connect both
            when diagnosis, fix, and recovery belong in the same commerce loop.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            The sooner the issue is clear, the sooner you can stop guessing and start testing the right fix.
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
  );
}
