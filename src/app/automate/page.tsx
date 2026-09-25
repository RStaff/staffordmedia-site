"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import {
  automationBusinessTypes,
  automationBlueprintPriceUsd,
  automationImprovements,
  automationSystems,
  automationWorkflowTextMaxLength,
  buildAutomationOpportunityPreview,
  parseAutomationBrief,
  parseAutomationBlueprintPaymentUrl,
  prepareAutomationBlueprintPurchase,
  storeAutomationBrief,
  type AutomationBrief,
  type AutomationOpportunityPreview,
} from "@/lib/automationIntake";

const improvementDescriptions: Partial<Record<(typeof automationImprovements)[number], string>> = {
  "Lead response": "Help new inquiries reach the right person with visible ownership.",
  "Missed-call follow-up": "Create a reliable next step when a call cannot be answered.",
  "Estimate / quote follow-up": "Keep issued estimates visible until the next action is decided.",
  "Repetitive data entry": "Reduce repeated copying while keeping a review checkpoint.",
  "Moving information between systems": "Prepare a controlled handoff between tools already in use.",
  Reporting: "Make recurring status information easier to assemble and review.",
  "Something else": "Use your workflow description to define a safe first boundary.",
};

const businessDescriptions: Record<(typeof automationBusinessTypes)[number], string> = {
  "Home Services": "Field and office teams coordinating inquiries, estimates, and schedules.",
  "Professional Services": "Client work that depends on review, judgment, and clear handoffs.",
  "Automotive / Field Services": "Service requests, dispatch work, appointments, and exceptions.",
  "E-commerce": "Storefront operations, customer questions, and order exceptions.",
  Other: "A workflow that does not fit the categories above.",
};

const systemDescriptions: Partial<Record<(typeof automationSystems)[number], string>> = {
  CRM: "Customer or prospect records.",
  Forms: "Website or internal information capture.",
  "E-commerce platform": "Storefront, order, or customer-service records.",
  "Accounting / business software": "Operational or financial records requiring review.",
  Other: "Another tool involved in this workflow.",
};

const blueprintDeliverables = [
  "One 60–90 minute workflow interview",
  "A visual current-workflow map",
  "Identification of the primary breakdown or revenue-risk point",
  "Up to three ranked automation opportunities",
  "A detailed design for the highest-priority solution",
  "Required software and integrations",
  "Human-review and failure-handling requirements",
  "Estimated implementation range and ongoing software costs",
  "A 30-minute findings review",
  "A written implementation proposal",
  "The full $750 credited toward an approved implementation",
];

function Choice({
  name,
  value,
  type,
  description,
}: {
  name: string;
  value: string;
  type: "checkbox" | "radio";
  description?: string;
}) {
  const descriptionId = useId();

  return (
    <label className="automate-choice">
      <input
        className="automate-choice-input"
        type={type}
        name={name}
        value={value}
        aria-label={value}
        aria-describedby={description ? descriptionId : undefined}
      />
      <span>
        <strong className="automate-choice-label">{value}</strong>
        {description ? <span id={descriptionId} className="automate-choice-description">{description}</span> : null}
      </span>
    </label>
  );
}

function WorkflowSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="automate-workflow-steps">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="automate-step-number">{index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function focusAndReveal(element: HTMLElement | null) {
  if (!element) return;
  element.focus({ preventScroll: true });
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export default function AutomatePage() {
  const router = useRouter();
  const paymentUrl = parseAutomationBlueprintPaymentUrl(
    process.env.NEXT_PUBLIC_AUTOMATION_BLUEPRINT_PAYMENT_URL,
  );
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
      focusAndReveal(previewHeadingRef.current);
    } else if (restoreFormFocus.current) {
      restoreFormFocus.current = false;
      focusAndReveal(formHeadingRef.current);
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

  function handlePurchase(event: MouseEvent<HTMLAnchorElement>) {
    if (!brief || !paymentUrl) {
      event.preventDefault();
      return;
    }
    setHandoffError(false);
    try {
      prepareAutomationBlueprintPurchase(
        window.sessionStorage,
        brief,
        paymentUrl,
      );
    } catch {
      event.preventDefault();
      setHandoffError(true);
    }
  }

  function handleAdjustAnswers() {
    restoreFormFocus.current = true;
    setPreview(null);
    setHandoffError(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow text-[var(--smc-accent)]">Start a focused conversation</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white md:text-5xl">Automate My Business</h1>
      <p className="body-lg mt-5 max-w-3xl">Describe the work you want to improve. You will receive an immediate, deterministic opportunity preview before deciding whether to contact us.</p>

      <form method="post" action="/automate" onSubmit={handleSubmit} className="mt-10" hidden={Boolean(preview)}>
        <fieldset disabled={!hydrated} className="grid gap-6">
          <section className="premium-panel-soft p-6 md:p-8">
            <h2 ref={formHeadingRef} tabIndex={-1} className="automate-focus-target text-2xl font-semibold text-white">What are you trying to improve?</h2>
            <p className="mt-2 text-sm text-slate-400">Choose every workflow area that is relevant. Your first selection does not commit you to a solution.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automationImprovements.map((item) => (
                <Choice key={item} name="improvement" value={item} type="checkbox" description={improvementDescriptions[item]} />
              ))}
            </div>
          </section>

          <section className="premium-panel-soft p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">What kind of business is this?</h2>
            <p className="mt-2 text-sm text-slate-400">Choose the closest match so the preview uses the right operational language.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automationBusinessTypes.map((item) => (
                <Choice key={item} name="businessType" value={item} type="radio" description={businessDescriptions[item]} />
              ))}
            </div>
          </section>

          <section className="premium-panel-soft p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white">What systems are involved?</h2>
            <p className="mt-2 text-sm text-slate-400">Choose the tools that touch this workflow. These are conversation prompts, not a claim about existing integrations.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automationSystems.map((item) => (
                <Choice key={item} name="system" value={item} type="checkbox" description={systemDescriptions[item]} />
              ))}
            </div>
          </section>

          <section className="premium-panel-soft p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-200">What happens today?
                <textarea name="currentWorkflow" maxLength={automationWorkflowTextMaxLength} className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the current workflow or problem." />
              </label>
              <label className="text-sm font-semibold text-slate-200">What should happen instead?
                <textarea name="desiredWorkflow" maxLength={automationWorkflowTextMaxLength} className="smc-field mt-3 min-h-40 resize-y py-3" placeholder="Describe the improvement you want to discuss." />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <button type="submit" className="smc-button smc-button-primary">Show My Opportunity</button>
              <Link href="/services" className="smc-button smc-button-secondary">Review Services</Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">This page does not create an account, collect credentials, or automate a customer system.</p>
          </section>
        </fieldset>
        {previewError ? <p role="alert" className="mt-4 text-sm text-red-300">Choose at least one item or describe a workflow to generate a useful preview.</p> : null}
      </form>

      {preview ? (
        <section aria-labelledby="opportunity-heading" className="automate-result mt-10 grid gap-8">
          <section className="automate-primary-diagnosis" data-testid="primary-diagnosis">
            <p className="eyebrow text-cyan-200">Your result</p>
            <h2 ref={previewHeadingRef} id="opportunity-heading" tabIndex={-1} className="automate-focus-target mt-3 text-3xl font-bold text-white md:text-4xl">Your biggest automation opportunity</h2>
            <p className="mt-5 text-2xl font-semibold text-[var(--smc-accent)]">{preview.opportunities[0].title}</p>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-200">{preview.primaryDiagnosis}</p>
            <div className="mt-5 max-w-4xl border-l-2 border-cyan-300 pl-4">
              <p className="text-xs font-semibold uppercase text-cyan-200">Why this can matter</p>
              <p className="mt-2 text-slate-300">{preview.primaryConsequence}</p>
            </div>
          </section>

          <section className="premium-panel-soft p-6 md:p-8" data-testid="recommended-system">
            <p className="eyebrow text-[var(--smc-accent)]">Recommended system</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{preview.opportunities[0].title}</h3>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">{preview.opportunities[0].recommendation}</p>
            <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"><strong className="text-white">Human approval stays in the workflow:</strong> {preview.opportunities[0].humanControl}</p>
          </section>

          <section aria-labelledby="workflow-comparison-heading">
            <div className="max-w-3xl">
              <p className="eyebrow text-[var(--smc-accent)]">Before and after</p>
              <h3 id="workflow-comparison-heading" className="mt-3 text-2xl font-semibold text-white">How the improved workflow would operate</h3>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <article className="premium-panel-soft p-6">
                <h4 className="text-lg font-semibold text-white">Current</h4>
                <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-200">
                  <strong className="block text-white">Your current workflow</strong>
                  <span className="mt-1 block whitespace-pre-wrap">{preview.currentWorkflowContext}</span>
                </p>
                <WorkflowSteps steps={preview.currentWorkflowSteps} />
              </article>
              <article className="premium-panel-soft border-cyan-300/30 p-6">
                <h4 className="text-lg font-semibold text-cyan-100">Improved</h4>
                <p className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-4 text-sm leading-6 text-slate-200">
                  <strong className="block text-cyan-100">Your desired outcome</strong>
                  <span className="mt-1 block whitespace-pre-wrap">{preview.desiredWorkflowContext}</span>
                </p>
                <WorkflowSteps steps={preview.improvedWorkflowSteps} />
              </article>
            </div>
          </section>

          <section className="premium-panel-soft p-6 md:p-8">
            <h3 className="text-2xl font-semibold text-white">Business value</h3>
            <p className="mt-2 text-sm text-slate-400">Practical mechanisms to validate, not promised financial outcomes.</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {preview.valueMechanisms.map((item) => <li key={item} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-medium text-slate-200">{item}</li>)}
            </ul>
          </section>

          {preview.opportunities.length > 1 ? (
            <section>
              <h3 className="text-xl font-semibold text-white">Secondary opportunities</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {preview.opportunities.slice(1, 3).map((opportunity) => (
                  <article key={opportunity.id} className="premium-panel-soft p-5">
                    <h4 className="font-semibold text-white">{opportunity.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{opportunity.recommendation}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="premium-panel-soft p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white">Human-control requirements</h3>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
              {preview.humanControls.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </section>

          <section className="automate-blueprint" aria-labelledby="blueprint-heading">
            <p className="eyebrow text-cyan-200">Paid engagement</p>
            <h3 id="blueprint-heading" className="mt-3 text-3xl font-bold text-white">$750 Automation Opportunity Blueprint</h3>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">A bounded engagement that turns the selected workflow into a reviewed current-state map and an implementation-ready first-system design.</p>
            <h4 className="mt-7 font-semibold text-white">What you receive</h4>
            <ul className="mt-4 grid gap-x-8 gap-y-3 text-sm leading-6 text-slate-200 md:grid-cols-2">
              {blueprintDeliverables.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-cyan-300">✓</span><span>{item}</span></li>)}
            </ul>
            <div className="mt-7 grid gap-4 border-t border-white/10 pt-6 text-sm leading-6 text-slate-300 md:grid-cols-2">
              <p><strong className="text-white">Delivery:</strong> The five-business-day delivery target begins after the workflow interview and receipt of required information.</p>
              <p><strong className="text-white">Exclusions:</strong> Implementation, software subscriptions, and third-party fees are not included. No revenue or savings are guaranteed.</p>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-200">
              Payment purchases the Blueprint engagement described above, not implementation.
              Ross manually confirms payment in Stripe before recording the engagement or scheduling work.
            </p>
            <div className="mt-5 flex flex-wrap gap-4" data-testid="blueprint-offer-actions">
              {paymentUrl ? (
                <a href={paymentUrl} onClick={handlePurchase} className="smc-button smc-button-primary">
                  Start My Blueprint — ${automationBlueprintPriceUsd}
                </a>
              ) : null}
              <button type="button" onClick={handleDiscussOpportunity} className="smc-button smc-button-secondary">Talk With Ross First</button>
            </div>
          </section>

          <section className="premium-panel-soft p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white">Four questions we confirm during the Blueprint</h3>
            <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-2">
              {preview.assessmentQuestions.map((item, index) => <li key={item}><strong className="text-white">{index + 1}.</strong> {item}</li>)}
            </ol>
          </section>

          <div className="flex flex-wrap gap-4">
            {paymentUrl ? (
              <a href={paymentUrl} onClick={handlePurchase} className="smc-button smc-button-primary">
                Start My Blueprint — ${automationBlueprintPriceUsd}
              </a>
            ) : null}
            <button type="button" onClick={handleDiscussOpportunity} className="smc-button smc-button-secondary">Talk With Ross First</button>
            <button type="button" onClick={handleAdjustAnswers} className="smc-button smc-button-secondary">Adjust My Answers</button>
          </div>
        </section>
      ) : null}

      {handoffError ? <p role="alert" className="mt-4 text-sm text-red-300">Your brief could not be saved privately. Nothing was submitted; please try again in a browser that permits same-tab storage.</p> : null}
    </main>
  );
}
