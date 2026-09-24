"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  automationBusinessTypes,
  automationImprovements,
  automationSystems,
  automationWorkflowTextMaxLength,
  parseAutomationBrief,
  storeAutomationBrief,
} from "@/lib/automationIntake";

export default function AutomatePage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [handoffError, setHandoffError] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated) return;
    setHandoffError(false);
    const formData = new FormData(event.currentTarget);
    const brief = parseAutomationBrief({
      improvement: formData.getAll("improvement").map(String),
      businessType: String(formData.get("businessType") || ""),
      system: formData.getAll("system").map(String),
      currentWorkflow: String(formData.get("currentWorkflow") || ""),
      desiredWorkflow: String(formData.get("desiredWorkflow") || ""),
    });
    try {
      storeAutomationBrief(window.sessionStorage, brief);
      router.push("/contact");
    } catch {
      setHandoffError(true);
    }
  }

  return <main className="mx-auto max-w-6xl px-6 py-16">
    <p className="eyebrow text-[var(--smc-accent)]">Start a focused conversation</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white md:text-5xl">Automate My Business</h1>
    <p className="body-lg mt-5 max-w-3xl">Describe the work you want to improve. We will use this context to discuss a practical, governed next step.</p>
    <form method="post" action="/automate" onSubmit={handleSubmit} className="mt-10">
      <fieldset disabled={!hydrated} className="grid gap-6">
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What are you trying to improve?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{automationImprovements.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="mt-1 accent-cyan-300" type="checkbox" name="improvement" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What kind of business is this?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{automationBusinessTypes.map((item) => <label key={item} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="accent-cyan-300" type="radio" name="businessType" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What systems are involved?</h2><p className="mt-2 text-slate-400">These are prompts for the conversation, not a claim about existing integrations.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{automationSystems.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="mt-1 accent-cyan-300" type="checkbox" name="system" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><div className="grid gap-6 md:grid-cols-2"><label className="text-sm font-semibold text-slate-200">What happens today?<textarea name="currentWorkflow" maxLength={automationWorkflowTextMaxLength} className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the current workflow or problem." /></label><label className="text-sm font-semibold text-slate-200">What should happen instead?<textarea name="desiredWorkflow" maxLength={automationWorkflowTextMaxLength} className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the improvement you want to discuss." /></label></div><div className="mt-6 flex flex-wrap gap-4"><button type="submit" className="smc-button smc-button-primary">Continue to Contact</button><Link href="/services" className="smc-button smc-button-secondary">Review Services</Link></div><p className="mt-4 text-sm text-slate-500">This page does not create an account, collect credentials, or automate a customer system.</p></section>
      </fieldset>
      {handoffError ? (
        <p role="alert" className="mt-4 text-sm text-red-300">
          Your brief could not be saved privately. Nothing was submitted; please try again in a browser that permits same-tab storage.
        </p>
      ) : null}
    </form>
  </main>;
}
