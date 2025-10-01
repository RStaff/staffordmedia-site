export const metadata = {
  title: "Services – Stafford Media Consulting",
  description: "Pragmatic AI for marketing: conversion agent, journey playbooks, lifecycle messaging, analytics, and integrations.",
};
import Section from "@/components/Section";
function Card({title, children}:{title:string; children:React.ReactNode}) {
  return (
    <div className="rounded-2xl bg-slate-900/50 ring-1 ring-white/10 p-6 space-y-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="text-white/80 text-sm">{children}</div>
    </div>
  );
}
export default function Page(){
  return (
    <main className="bg-[#0B1220] min-h-screen text-white">
      <Section eyebrow="What we do" title="Services that connect strategy to revenue">
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Conversion Agent (Abando™)">Answers objections in real time (shipping, price, trust), guides buyers through checkout, and recovers revenue without redesigns.</Card>
          <Card title="Journey Playbooks">Proven flows for discount, urgency, FAQ, and win-back—tuned to your brand voice and data.</Card>
          <Card title="Lifecycle Messaging">Email/SMS sequences that speak in your voice and move customers from interest to purchase.</Card>
          <Card title="Attribution & Analytics">Clean reporting that shows where revenue is created so you can double down with confidence.</Card>
          <Card title="Integrations">Shopify, WooCommerce, BigCommerce, custom carts, and data pipelines—without disrupting your stack.</Card>
        </div>
      </Section>
    </main>
  );
}
