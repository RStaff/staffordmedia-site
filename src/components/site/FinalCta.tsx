import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="premium-panel p-6 text-center md:p-10">
          <p className="eyebrow text-[var(--smc-accent)]">Next step</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Tell us what you want to improve.
          </h2>
          <p className="body-md mx-auto mt-5 max-w-2xl">
            Start with a business problem, workflow, or follow-up challenge. We can discuss whether a focused technology or automation path makes sense.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            No automated diagnosis or outcome is promised before the problem and scope are understood.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/services" className="smc-button smc-button-primary">
              Automate My Business
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
