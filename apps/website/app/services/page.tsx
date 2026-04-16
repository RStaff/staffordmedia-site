export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        AI Automation Consulting
      </h1>
      <p className="mt-4 text-zinc-700 max-w-3xl">
        We help you identify the highest-leverage workflows, design sensible
        automations, and build KPI plans that validate ROI quickly. Perfect as
        an add-on to Abando.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Kickstart (2–4 weeks)",
            d: "Audit, quick wins, playbooks, KPI plan.",
          },
          {
            t: "Scale (Quarterly)",
            d: "Roadmap, experiments, team enablement.",
          },
          { t: "Custom", d: "Tailored engagement for complex stacks." },
        ].map((p) => (
          <div key={p.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{p.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a
          href="/contact"
          className="rounded-xl border px-5 py-3 text-sm font-medium"
        >
          Book a consult
        </a>
      </div>
    </div>
  );
}
export const metadata = {
  title: "Services – Stafford Media Consulting",
  description: "Pragmatic AI for marketing: conversion agent, journey playbooks, lifecycle messaging, analytics, and integrations.",
};
import Section from "@/components/Section";

function Card({title, children}:{title:string; children:React.ReactNode}) {
export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        AI Automation Consulting
      </h1>
      <p className="mt-4 text-zinc-700 max-w-3xl">
        We help you identify the highest-leverage workflows, design sensible
        automations, and build KPI plans that validate ROI quickly. Perfect as
        an add-on to Abando.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Kickstart (2–4 weeks)",
            d: "Audit, quick wins, playbooks, KPI plan.",
          },
          {
            t: "Scale (Quarterly)",
            d: "Roadmap, experiments, team enablement.",
          },
          { t: "Custom", d: "Tailored engagement for complex stacks." },
        ].map((p) => (
          <div key={p.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{p.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <a
          href="/contact"
          className="rounded-xl border px-5 py-3 text-sm font-medium"
        >
          Book a consult
        </a>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Services – Stafford Media",
  description: "Services that connect strategy to revenue: conversion agent, journey playbooks, lifecycle messaging, analytics, integrations.",
};

export default function Page(){
  return (
    <main className="bg-[#0B1220] min-h-screen text-white">
      <Section eyebrow="What we do" title="Services that connect strategy to revenue">
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Conversion Agent (Abando™)">
            Answer objections in real time (shipping, price, trust), keep buyers in-flow, and recover carts without redesigns.
          </Card>
          <Card title="Journey Playbooks">
            Discount, urgency, FAQ, and win-back flows tuned to your brand voice and your data.
          </Card>
          <Card title="Lifecycle Messaging">
            Email/SMS sequences that sound like you — moving customers from interest to purchase.
          </Card>
          <Card title="Attribution & Analytics">
            Clean reporting that shows <em>where</em> revenue is created so you can double down with confidence.
          </Card>
          <Card title="Integrations">
            Shopify, WooCommerce, BigCommerce, custom carts, and data pipelines — without disrupting your stack.
          </Card>
        </div>
      </Section>
    </main>
  );
}
