<<<<<<< HEAD
<<<<<<< HEAD
import Section from "@/components/Section";

/** App Router build flags must be at module top-level (not inside the component) */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <main>
      <Section eyebrow="Pricing" title="Simple, usage-based plans">
        <p>
          Pay for value, not promises. Abando installs with no redesigns or downtime,
          and you can cancel anytime.
        </p>
      </Section>
=======
=======
import { PRICE_BASIC, PRICE_GROWTH, PRICE_PRO, TRIAL_URL } from "@/lib/config";

>>>>>>> dd26c5a (feat(site): refined About/Services, inline Pricing (fix 404), app robots/sitemap, SITE_URL)
export const metadata = {
  title: "Pricing – Stafford Media",
  description: "Simple plans that pay for themselves after a single recovered cart.",
};

function Tier({ name, price, features }:{ name:string; price:string; features:string[] }) {
  return (
    <div className="rounded-2xl bg-slate-900/50 ring-1 ring-white/10 p-8 md:p-10 flex flex-col gap-6">
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <div className="text-4xl font-bold text-blue-400">${price}<span className="text-base text-white/70">/mo</span></div>
      <ul className="space-y-2 text-white/80 text-sm">
        {features.map((f,i)=>(
          <li key={i} className="flex gap-2 items-start">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 block" /><span>{f}</span>
          </li>
        ))}
      </ul>
      <a href={TRIAL_URL} className="mt-auto inline-flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-400 transition text-white font-medium px-4 py-2">
        Start Free Trial
      </a>
    </div>
  );
}

export default function Page(){
// @ts-expect-error-next-line// @ts-expect-error-next-linereturn (
    <main className="bg-[#0B1220] min-h-screen text-white">
<<<<<<< HEAD
      <Pricing />
>>>>>>> f751bc5 (feat(site): About + Services + Pricing pages (drop-in))
=======
      <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-8">Choose your plan</h1>
        <p className="text-white/80 mb-8">
          Abando™ often pays for itself after a single recovered cart. 14-day free trial. Cancel anytime.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Tier name="Basic"  price={PRICE_BASIC}  features={["Core conversion agent","Email support"]}/>
          <Tier name="Growth" price={PRICE_GROWTH} features={["All Basic features","Advanced playbooks & integrations","Priority email support"]}/>
          <Tier name="Pro"    price={PRICE_PRO}    features={["All Growth features","Dedicated success manager","24/7 priority support"]}/>
        </div>
      </div>
>>>>>>> dd26c5a (feat(site): refined About/Services, inline Pricing (fix 404), app robots/sitemap, SITE_URL)
    </main>
  );
}
