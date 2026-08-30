"use client";

import Link from "next/link";

const improvements = ["Lead response", "Missed-call follow-up", "Customer follow-up", "Appointment reminders", "Estimate / quote follow-up", "Scheduling", "Repetitive data entry", "Reporting", "Moving information between systems", "E-commerce workflow", "Something else"];
const businessTypes = ["Home Services", "Professional Services", "Automotive / Field Services", "E-commerce", "Other"];
const systems = ["CRM", "Email", "Phone", "Calendar", "Website", "Forms", "E-commerce platform", "Spreadsheets", "Accounting / business software", "Other"];

export default function AutomatePage() {
  return <main className="mx-auto max-w-6xl px-6 py-16">
    <p className="eyebrow text-[var(--smc-accent)]">Start a focused conversation</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white md:text-5xl">Automate My Business</h1>
    <p className="body-lg mt-5 max-w-3xl">Describe the work you want to improve. We will use this context to discuss a practical, governed next step.</p>
    <form action="/contact" method="get" className="mt-10 grid gap-6">
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What are you trying to improve?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{improvements.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="mt-1 accent-cyan-300" type="checkbox" name="improvement" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What kind of business is this?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{businessTypes.map((item) => <label key={item} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="accent-cyan-300" type="radio" name="businessType" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What systems are involved?</h2><p className="mt-2 text-slate-400">These are prompts for the conversation, not a claim about existing integrations.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{systems.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="mt-1 accent-cyan-300" type="checkbox" name="system" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><div className="grid gap-6 md:grid-cols-2"><label className="text-sm font-semibold text-slate-200">What happens today?<textarea name="currentWorkflow" className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the current workflow or problem." /></label><label className="text-sm font-semibold text-slate-200">What should happen instead?<textarea name="desiredWorkflow" className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the improvement you want to discuss." /></label></div><div className="mt-6 flex flex-wrap gap-4"><button type="submit" className="smc-button smc-button-primary">Continue to Contact</button><Link href="/services" className="smc-button smc-button-secondary">Review Services</Link></div><p className="mt-4 text-sm text-slate-500">This page does not create an account, collect credentials, or automate a customer system.</p></section>
    </form>
  </main>;
}
