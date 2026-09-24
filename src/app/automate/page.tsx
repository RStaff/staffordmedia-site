"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  automationBusinessTypes,
  automationImprovements,
  automationSystems,
  automationWorkflowTextMaxLength,
  buildAutomationOpportunityPreview,
  parseAutomationBrief,
  storeAutomationBrief,
  type AutomationBrief,
  type AutomationOpportunityPreview,
} from "@/lib/automationIntake";

export default function AutomatePage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [handoffError, setHandoffError] = useState(false);
  const [brief, setBrief] = useState<AutomationBrief | null>(null);
  const [preview, setPreview] = useState<AutomationOpportunityPreview | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const restoreFormFocus = useRef(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (preview) {
      previewHeadingRef.current?.focus();
    } else if (restoreFormFocus.current) {
      restoreFormFocus.current = false;
      formHeadingRef.current?.focus();
    }
  }, [preview]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated) return;
    setHandoffError(false);
    setPreviewError(false);
    const formData = new FormData(event.currentTarget);
    const nextBrief = parseAutomationBrief({
      improvement: formData.getAll("improvement").map(String),
      businessType: String(formData.get("businessType") || ""),
      system: formData.getAll("system").map(String),
      currentWorkflow: String(formData.get("currentWorkflow") || ""),
      desiredWorkflow: String(formData.get("desiredWorkflow") || ""),
    });
    const nextPreview = buildAutomationOpportunityPreview(nextBrief);
    if (!nextPreview) {
      setPreviewError(true);
      return;
    }
    setBrief(nextBrief);
    setPreview(nextPreview);
  }

  function handleDiscussOpportunity() {
    if (!brief) return;
    setHandoffError(false);
    try {
      storeAutomationBrief(window.sessionStorage, brief);
      router.push("/contact");
    } catch {
      setHandoffError(true);
    }
  }

  function handleAdjustAnswers() {
    restoreFormFocus.current = true;
    setPreview(null);
    setHandoffError(false);
  }

  return <main className="mx-auto max-w-6xl px-6 py-16">
    <p className="eyebrow text-[var(--smc-accent)]">Start a focused conversation</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white md:text-5xl">Automate My Business</h1>
    <p className="body-lg mt-5 max-w-3xl">Describe the work you want to improve. We will use this context to discuss a practical, governed next step.</p>
    <form method="post" action="/automate" onSubmit={handleSubmit} className="mt-10" hidden={Boolean(preview)}>
      <fieldset disabled={!hydrated} className="grid gap-6">
      <section className="premium-panel-soft p-6 md:p-8"><h2 ref={formHeadingRef} tabIndex={-1} className="text-2xl font-semibold text-white">What are you trying to improve?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{automationImprovements.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="mt-1 accent-cyan-300" type="checkbox" name="improvement" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What kind of business is this?</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{automationBusinessTypes.map((item) => <label key={item} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="accent-cyan-300" type="radio" name="businessType" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><h2 className="text-2xl font-semibold text-white">What systems are involved?</h2><p className="mt-2 text-slate-400">These are prompts for the conversation, not a claim about existing integrations.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{automationSystems.map((item) => <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200"><input className="mt-1 accent-cyan-300" type="checkbox" name="system" value={item} />{item}</label>)}</div></section>
      <section className="premium-panel-soft p-6 md:p-8"><div className="grid gap-6 md:grid-cols-2"><label className="text-sm font-semibold text-slate-200">What happens today?<textarea name="currentWorkflow" maxLength={automationWorkflowTextMaxLength} className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the current workflow or problem." /></label><label className="text-sm font-semibold text-slate-200">What should happen instead?<textarea name="desiredWorkflow" maxLength={automationWorkflowTextMaxLength} className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the improvement you want to discuss." /></label></div><div className="mt-6 flex flex-wrap gap-4"><button type="submit" className="smc-button smc-button-primary">Show My Opportunity</button><Link href="/services" className="smc-button smc-button-secondary">Review Services</Link></div><p className="mt-4 text-sm text-slate-500">This page does not create an account, collect credentials, or automate a customer system.</p></section>
      </fieldset>
      {previewError ? (
        <p role="alert" className="mt-4 text-sm text-red-300">
          Choose at least one item or describe a workflow to generate a useful preview.
        </p>
      ) : null}
    </form>
    {preview ? (
      <section aria-labelledby="opportunity-heading" className="mt-10 grid gap-8">
        <div>
          <p className="eyebrow text-[var(--smc-accent)]">Your first automation opportunity</p>
          <h2 ref={previewHeadingRef} id="opportunity-heading" tabIndex={-1} className="mt-3 text-3xl font-bold text-white">
            {preview.opportunities[0].title}
          </h2>
        </div>
        <section className="premium-panel-soft p-6 md:p-8">
          <h3 className="text-xl font-semibold text-white">What we see</h3>
          <p className="mt-3 text-slate-300">{preview.whatWeSee}</p>
          <p className="mt-5 font-semibold text-cyan-200">Recommended first automation</p>
          <p className="mt-2 text-slate-300">{preview.opportunities[0].recommendation}</p>
        </section>
        <section className="grid gap-4 md:grid-cols-2" aria-label="Current to improved workflow">
          <div className="premium-panel-soft p-6">
            <h3 className="text-lg font-semibold text-white">Current workflow</h3>
            <p className="mt-3 whitespace-pre-wrap text-slate-300">{preview.currentWorkflow}</p>
          </div>
          <div className="premium-panel-soft p-6">
            <h3 className="text-lg font-semibold text-white">Improved workflow</h3>
            <p className="mt-3 whitespace-pre-wrap text-slate-300">{preview.improvedWorkflow}</p>
          </div>
        </section>
        {preview.opportunities.length > 1 ? (
          <section>
            <h3 className="text-xl font-semibold text-white">Other opportunities to assess</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {preview.opportunities.slice(1).map((opportunity) => (
                <article key={opportunity.id} className="premium-panel-soft p-6">
                  <h4 className="font-semibold text-white">{opportunity.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{opportunity.recommendation}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="premium-panel-soft p-6">
            <h3 className="text-xl font-semibold text-white">Human-control requirements</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300">
              {preview.humanControls.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
          <section className="premium-panel-soft p-6">
            <h3 className="text-xl font-semibold text-white">How this could help</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300">
              {preview.valueMechanisms.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>
        </div>
        <section className="premium-panel-soft p-6 md:p-8">
          <h3 className="text-xl font-semibold text-white">What we would confirm during assessment</h3>
          <ol className="mt-4 grid gap-3 text-sm text-slate-300">
            {preview.assessmentQuestions.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}
          </ol>
        </section>
        <div className="flex flex-wrap gap-4">
          <button type="button" onClick={handleDiscussOpportunity} className="smc-button smc-button-primary">
            Discuss This Opportunity
          </button>
          <button type="button" onClick={handleAdjustAnswers} className="smc-button smc-button-secondary">
            Adjust My Answers
          </button>
        </div>
      </section>
    ) : null}
    {handoffError ? (
        <p role="alert" className="mt-4 text-sm text-red-300">
          Your brief could not be saved privately. Nothing was submitted; please try again in a browser that permits same-tab storage.
        </p>
      ) : null}
  </main>;
}
