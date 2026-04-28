import Link from "next/link";

export const metadata = {
  title: "Abando — Stafford Media Consulting™",
  description:
    "Abando helps ecommerce brands prove, measure, and improve recovered revenue through AI-assisted recovery flows.",
};

export default function AbandoPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.16),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300">
            Abando Recovery Engine
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white">
            Prove, measure, and improve recovered revenue.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Abando is the recovery engine that scales after the highest-priority conversion issue is clear. It helps bring shoppers back,
            measure return activity, attribute recovered revenue, and improve recovery performance over time.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm font-semibold text-white">1. Trigger recovery</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Send a recovery message when a shopper leaves with buying intent.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm font-semibold text-white">2. Measure return</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Track whether the shopper returns after the recovery message.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm font-semibold text-white">3. Attribute revenue</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Connect recovery activity to revenue so performance can improve.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/recovery-demo"
              className="rounded-full bg-violet-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-200"
            >
              See Recovery Proof Demo
            </Link>

            <Link
              href="/shopifixer"
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-300 hover:text-violet-200"
            >
              Diagnose with ShopiFixer first
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
