export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Pricing – Stafford Media Consulting",
  description: "Simple plans that pay for themselves after a single recovered cart.",
};

export default function Page(){
  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Choose your plan</h1>
      <p className="text-white/80 mb-10">Abando™ pays for itself after a single recovered cart. 14-day free trial. Cancel anytime.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-slate-900/50 ring-1 ring-white/10 p-8">
          <h3 className="text-xl font-semibold">Basic</h3>
          <div className="text-4xl font-bold mt-2">$29<span className="text-base text-white/70">/mo</span></div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Core conversion agent</li>
            <li>Email support</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-900/50 ring-1 ring-white/10 p-8">
          <h3 className="text-xl font-semibold">Growth</h3>
          <div className="text-4xl font-bold mt-2">$59<span className="text-base text-white/70">/mo</span></div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>All Basic features</li>
            <li>Playbooks & integrations</li>
            <li>Priority email support</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-900/50 ring-1 ring-white/10 p-8">
          <h3 className="text-xl font-semibold">Pro</h3>
          <div className="text-4xl font-bold mt-2">$149<span className="text-base text-white/70">/mo</span></div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>All Growth features</li>
            <li>Dedicated success manager</li>
            <li>24/7 priority support</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
