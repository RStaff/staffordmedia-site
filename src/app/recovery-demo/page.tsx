import Link from "next/link";

export const metadata = {
  title: "Abando Recovery Demo — Stafford Media Consulting™",
  description: "Experience how Abando recovery proof works before install."
};

export default function RecoveryDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
            Abando Recovery Demo
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            See the proof loop: message sent, shopper returns, revenue attributed.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            This demo is the proof path for Abando: recovery message, return tracking, and recovered revenue attribution.
            It is separate from the ShopiFixer audit and fix path.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm font-semibold text-white">1. Trigger recovery</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">A shopper leaves after showing purchase intent.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm font-semibold text-white">2. Send message</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Abando sends a recovery message by email or phone.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm font-semibold text-white">3. Measure return</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">The system tracks return activity and recovered revenue proof.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shopifixer" className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-300 hover:text-violet-200">
              Run ShopiFixer Audit
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
