"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  automationBusinessTypes,
  automationBlueprintOfferAuthority,
  automationBlueprintPriceUsd,
  automationImprovements,
  automationSystems,
  automationWorkflowTextMaxLength,
  buildAutomationOpportunityPreview,
  parseAutomationBrief,
  prepareAutomationBlueprintPurchase,
  storeAutomationBrief,
  type AutomationBrief,
  type AutomationBlueprintPaymentEnvironment,
  type AutomationOpportunityPreview,
} from "@/lib/automationIntake";
import { useStaffordMediaAnalytics } from "@/components/analytics/AnalyticsProvider";
import { trackBlueprintCheckoutBeforeNavigation } from "@/lib/analytics";

const improvementDescriptions: Partial<
  Record<(typeof automationImprovements)[number], string>
> = {
  "Lead response":
    "Help new inquiries reach the right person with visible ownership.",
  "Missed-call follow-up":
    "Create a reliable next step when a call cannot be answered.",
  "Estimate / quote follow-up":
    "Keep issued estimates visible until the next action is decided.",
  "Repetitive data entry":
    "Reduce repeated copying while keeping a person in charge of review.",
  "Moving information between systems":
    "Move information between the tools your team already uses, with a person checking the work.",
  Reporting: "Make recurring status information easier to assemble and review.",
  "Something else":
    "Describe the work so we can identify a practical first step.",
};

const businessDescriptions: Record<
  (typeof automationBusinessTypes)[number],
  string
> = {
  "Home Services":
    "Field and office teams coordinating inquiries, estimates, and schedules.",
  "Professional Services":
    "Client work that depends on review, judgment, and clear handoffs.",
  "Automotive / Field Services":
    "Service requests, dispatch work, appointments, and exceptions.",
  "E-commerce":
    "Storefront operations, customer questions, and order exceptions.",
  Other: "A workflow that does not fit the categories above.",
};

const systemDescriptions: Partial<
  Record<(typeof automationSystems)[number], string>
> = {
  CRM: "Customer or prospect records.",
  Forms: "Website or internal information capture.",
  "E-commerce platform": "Storefront, order, or customer-service records.",
  "Accounting / business software":
    "Operational or financial records requiring review.",
  Other: "Another tool involved in this workflow.",
};

const blueprintDeliverables = [
  {
    title: "Workflow interview and current-state map",
    value: "Understand delays and repeated work.",
    details: [
      "60–90 minute working session",
      "Documented current process and breakdown points",
      "Baseline measures where available, and clear success measures for the proposed improvement",
    ],
  },
  {
    title: "Primary automation diagnosis",
    value: "Identify the main problem worth addressing.",
    details: [
      "Most important problem to solve first",
      "Operational consequences",
      "What must remain under human control",
    ],
  },
  {
    title: "Recommended system design",
    value: "Understand how the proposed solution would work.",
    details: [
      "Triggers, workflow, outputs, tools and integrations",
      "Human approvals, exception handling and privacy considerations",
    ],
  },
  {
    title: "Prioritized opportunities",
    value: "Decide what comes first and what can wait.",
    details: [
      "Up to three opportunities ranked by business value, feasibility and implementation effort",
    ],
  },
  {
    title: "Implementation roadmap",
    value: "Understand the steps toward execution.",
    details: [
      "Phases, estimated timeline, software requirements, responsibilities and implementation price range",
    ],
  },
  {
    title: "Written Blueprint and review",
    value: "Leave with a documented plan to review and discuss.",
    details: ["Customer-owned written deliverable", "30-minute review meeting"],
  },
];

const blueprintNextSteps = [
  { heading: "Purchase", detail: "Start the one-time Blueprint." },
  {
    heading: "Connect",
    detail: "Stafford Media contacts you within one business day.",
  },
  { heading: "Interview", detail: "Complete the workflow interview." },
  { heading: "Review", detail: "Receive and review the Blueprint." },
  {
    heading: "Choose",
    detail: "Decide whether to implement without obligation.",
  },
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
        {description ? (
          <span id={descriptionId} className="automate-choice-description">
            {description}
          </span>
        ) : null}
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
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  element.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function AutomateClient({
  paymentUrl,
  paymentEnvironment,
  navigateToCheckout = (destination) => window.location.assign(destination),
}: {
  paymentUrl: string | null;
  paymentEnvironment: AutomationBlueprintPaymentEnvironment;
  navigateToCheckout?: (destination: string) => void;
}) {
  const router = useRouter();
  const analytics = useStaffordMediaAnalytics();
  const [hydrated, setHydrated] = useState(false);
  const [handoffError, setHandoffError] = useState(false);
  const [brief, setBrief] = useState<AutomationBrief | null>(null);
  const [preview, setPreview] = useState<AutomationOpportunityPreview | null>(
    null,
  );
  const [previewError, setPreviewError] = useState(false);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const restoreFormFocus = useRef(false);
  const automateViewTracked = useRef(false);
  const formStartTracked = useRef(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (
      analytics.consent === "accepted" &&
      analytics.ready &&
      !automateViewTracked.current
    ) {
      automateViewTracked.current = analytics.track("automate_view");
    }
  }, [analytics]);

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
    analytics.track("automation_result_view");
  }

  function handleFormStart() {
    if (!formStartTracked.current) {
      formStartTracked.current = analytics.track("form_start");
    }
  }

  function handleDiscussOpportunity() {
    if (!brief) return;
    setHandoffError(false);
    try {
      storeAutomationBrief(window.sessionStorage, brief);
      analytics.track("contact_click");
      router.push("/contact");
    } catch {
      setHandoffError(true);
    }
  }

  function handlePurchase() {
    if (!brief || !paymentUrl) {
      setHandoffError(true);
      return;
    }
    setHandoffError(false);
    try {
      const destination = prepareAutomationBlueprintPurchase(
        window.sessionStorage,
        brief,
        paymentUrl,
        paymentEnvironment,
      );
      if (!destination) {
        setHandoffError(true);
        return;
      }
      trackBlueprintCheckoutBeforeNavigation(() => {
        try {
          navigateToCheckout(destination);
        } catch {
          setHandoffError(true);
        }
      });
    } catch {
      setHandoffError(true);
    }
  }

  function handleAdjustAnswers() {
    restoreFormFocus.current = true;
    setPreview(null);
    setHandoffError(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-14">
      <p className="eyebrow text-[var(--smc-accent)]">
        Start a focused conversation
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-white md:text-5xl">
        Automate My Business
      </h1>
      <p className="body-lg mt-4 max-w-3xl">
        Describe the work you want to improve. You will see a clear starting
        point and an example of how the work could flow before deciding whether
        to contact us.
      </p>

      <form
        method="post"
        action="/automate"
        onSubmit={handleSubmit}
        onChangeCapture={handleFormStart}
        className="mt-8"
        hidden={Boolean(preview)}
      >
        <fieldset disabled={!hydrated} className="grid gap-4">
          <section className="premium-panel-soft p-5 md:p-6">
            <h2
              ref={formHeadingRef}
              tabIndex={-1}
              className="automate-focus-target text-2xl font-semibold text-white"
            >
              What are you trying to improve?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Choose the areas that sound most like the work you want to
              improve. This does not commit you to a solution.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automationImprovements.map((item) => (
                <Choice
                  key={item}
                  name="improvement"
                  value={item}
                  type="checkbox"
                  description={improvementDescriptions[item]}
                />
              ))}
            </div>
          </section>

          <section className="premium-panel-soft p-5 md:p-6">
            <h2 className="text-2xl font-semibold text-white">
              What kind of business is this?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Choose the closest match so the example fits your type of work.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automationBusinessTypes.map((item) => (
                <Choice
                  key={item}
                  name="businessType"
                  value={item}
                  type="radio"
                  description={businessDescriptions[item]}
                />
              ))}
            </div>
          </section>

          <section className="premium-panel-soft p-5 md:p-6">
            <h2 className="text-2xl font-semibold text-white">
              What systems are involved?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Choose the tools involved today. This helps frame the
              conversation; it does not mean they are already connected.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {automationSystems.map((item) => (
                <Choice
                  key={item}
                  name="system"
                  value={item}
                  type="checkbox"
                  description={systemDescriptions[item]}
                />
              ))}
            </div>
          </section>

          <section className="premium-panel-soft p-5 md:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="current-workflow"
                  className="text-sm font-semibold text-slate-200"
                >
                  What happens today?
                </label>
                <span
                  id="current-workflow-example"
                  className="mt-1 block text-xs font-normal leading-5 text-slate-500"
                >
                  Example: New inquiries arrive by phone and email, then someone
                  adds them to a shared list.
                </span>
                <textarea
                  id="current-workflow"
                  name="currentWorkflow"
                  aria-describedby="current-workflow-example"
                  maxLength={automationWorkflowTextMaxLength}
                  className="smc-field mt-2 min-h-32 resize-y py-3"
                  placeholder="Describe the current workflow or problem."
                />
              </div>
              <div>
                <label
                  htmlFor="desired-workflow"
                  className="text-sm font-semibold text-slate-200"
                >
                  What should happen instead?
                  <span
                    aria-hidden="true"
                    className="font-normal text-slate-400"
                  >
                    {" "}
                    (optional)
                  </span>
                </label>
                <span
                  id="desired-workflow-example"
                  className="mt-1 block text-xs font-normal leading-5 text-slate-500"
                >
                  Example: Each inquiry gets an owner, a due time, and a visible
                  outcome.
                </span>
                <textarea
                  id="desired-workflow"
                  name="desiredWorkflow"
                  aria-label="What should happen instead?"
                  aria-describedby="desired-workflow-example"
                  maxLength={automationWorkflowTextMaxLength}
                  className="smc-field mt-2 min-h-32 resize-y py-3"
                  placeholder="Describe the outcome you would like."
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button type="submit" className="smc-button smc-button-primary">
                Show My Opportunity
              </button>
              <Link
                href="/services"
                className="text-sm font-medium text-slate-400 underline decoration-slate-500 underline-offset-4 transition hover:text-white"
              >
                Review Services
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              This page does not create an account, collect credentials, or
              automate a customer system.
            </p>
          </section>
        </fieldset>
        {previewError ? (
          <p role="alert" className="mt-4 text-sm text-red-300">
            Choose at least one item or describe a workflow to generate a useful
            preview.
          </p>
        ) : null}
      </form>

      {preview ? (
        <section
          aria-labelledby="opportunity-heading"
          className="automate-result mt-8 grid gap-6"
        >
          <section
            className="automate-primary-diagnosis"
            data-testid="primary-diagnosis"
          >
            <p className="eyebrow text-cyan-200">Your result</p>
            <h2
              ref={previewHeadingRef}
              id="opportunity-heading"
              tabIndex={-1}
              className="automate-focus-target mt-3 text-3xl font-bold text-white md:text-4xl"
            >
              A suggested starting point
            </h2>
            <p className="mt-5 text-2xl font-semibold text-[var(--smc-accent)]">
              {preview.opportunities[0].title}
            </p>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-200">
              {preview.primaryDiagnosis}
            </p>
            <div className="mt-5 max-w-4xl border-l-2 border-cyan-300 pl-4">
              <p className="text-xs font-semibold uppercase text-cyan-200">
                Why this can matter
              </p>
              <p className="mt-2 text-slate-300">
                {preview.primaryConsequence}
              </p>
            </div>
          </section>

          <section
            className="premium-panel-soft p-5 md:p-6"
            data-testid="recommended-system"
          >
            <p className="eyebrow text-[var(--smc-accent)]">
              Recommended system
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {preview.opportunities[0].title}
            </h3>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              {preview.opportunities[0].recommendation}
            </p>
            <div
              className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4"
              data-testid="recommendation-basis"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                What this recommendation used
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
                {preview.recommendationBasis.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
              <strong className="text-white">
                Human approval stays in the workflow:
              </strong>{" "}
              {preview.opportunities[0].humanControl}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              This is an illustrative proposed improvement based only on the
              answers above. It is not an audit, an implemented result, or the
              paid Blueprint. The Blueprint validates the workflow and produces
              the full decision-ready plan.
            </p>
          </section>

          <section aria-labelledby="workflow-comparison-heading">
            <div className="max-w-3xl">
              <p className="eyebrow text-[var(--smc-accent)]">
                Current and proposed
              </p>
              <h3
                id="workflow-comparison-heading"
                className="mt-3 text-2xl font-semibold text-white"
              >
                Illustrative workflow comparison
              </h3>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <article className="premium-panel-soft p-5">
                <h4 className="text-lg font-semibold text-white">
                  {preview.currentWorkflowProvided
                    ? "Current, as described"
                    : "Example current workflow based on your selections."}
                </h4>
                <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-200">
                  <strong className="block text-white">
                    Your current workflow
                  </strong>
                  <span className="mt-1 block whitespace-pre-wrap">
                    {preview.currentWorkflowContext}
                  </span>
                </p>
                <WorkflowSteps steps={preview.currentWorkflowSteps} />
              </article>
              <article className="premium-panel-soft border-cyan-300/30 p-5">
                <h4 className="text-lg font-semibold text-cyan-100">
                  Proposed improvement
                </h4>
                <p className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-4 text-sm leading-6 text-slate-200">
                  <strong className="block text-cyan-100">
                    Your desired outcome
                  </strong>
                  <span className="mt-1 block whitespace-pre-wrap">
                    {preview.desiredWorkflowContext}
                  </span>
                </p>
                <WorkflowSteps steps={preview.improvedWorkflowSteps} />
              </article>
            </div>
          </section>

          <section className="premium-panel-soft p-5 md:p-6">
            <h3 className="text-2xl font-semibold text-white">
              Business value
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Practical mechanisms to validate, not promised financial outcomes.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {preview.valueMechanisms.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-medium text-slate-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {preview.opportunities.length > 1 ? (
            <section>
              <h3 className="text-xl font-semibold text-white">
                Secondary opportunities
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {preview.opportunities.slice(1, 3).map((opportunity) => (
                  <article
                    key={opportunity.id}
                    className="premium-panel-soft p-5"
                  >
                    <h4 className="font-semibold text-white">
                      {opportunity.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {opportunity.recommendation}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="premium-panel-soft p-5 md:p-6">
            <h3 className="text-xl font-semibold text-white">
              Human-control requirements
            </h3>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
              {preview.humanControls.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="premium-panel-soft p-5 md:p-6">
            <h3 className="text-xl font-semibold text-white">
              Four questions we confirm during the Blueprint
            </h3>
            <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-300 md:grid-cols-2">
              {preview.assessmentQuestions.map((item, index) => (
                <li key={item}>
                  <strong className="text-white">{index + 1}.</strong> {item}
                </li>
              ))}
            </ol>
          </section>

          <section
            className="automate-blueprint"
            aria-labelledby="blueprint-heading"
          >
            <p className="eyebrow text-cyan-200">Paid engagement</p>
            <h3
              id="blueprint-heading"
              className="mt-3 text-3xl font-bold text-white"
            >
              Your $750 Automation Opportunity Blueprint
            </h3>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-200">
              The free result above is a starting point based on your answers.
              The paid Blueprint examines one workflow with you, validates the
              problem and proposed approach, and gives you a decision-ready
              plan—not implementation itself.
            </p>

            <h4 className="mt-8 text-lg font-semibold text-white">
              What your Blueprint includes
            </h4>
            <ol
              className="mt-5 grid gap-4 md:grid-cols-2"
              data-testid="blueprint-deliverables"
            >
              {blueprintDeliverables.map((deliverable, index) => (
                <li
                  key={deliverable.title}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="automate-step-number">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="font-semibold text-white">
                        {deliverable.title}
                      </h5>
                      <p className="mt-2 text-sm font-medium leading-6 text-cyan-100">
                        <span className="text-slate-400">Practical value:</span>{" "}
                        {deliverable.value}
                      </p>
                      <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-300">
                        {deliverable.details.map((detail) => (
                          <li key={detail}>• {detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 grid gap-4 border-t border-white/10 pt-6 text-sm leading-6 text-slate-300 md:grid-cols-3">
              <p>
                <strong className="text-white">Delivery:</strong> Delivered
                within five business days after the interview and receipt of
                required information.
              </p>
              <p>
                <strong className="text-white">Implementation credit:</strong>{" "}
                The entire $750 is credited toward an approved Stafford Media
                implementation.
              </p>
              <p>
                <strong className="text-white">Exclusions:</strong>{" "}
                Implementation work, software subscriptions and third-party fees
                are excluded.
              </p>
            </div>

            <div className="mt-7 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] p-4 md:p-5">
              <h4 className="text-lg font-semibold text-white">
                What happens next
              </h4>
              <ol className="mt-4 grid gap-4 text-sm leading-6 text-slate-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {blueprintNextSteps.map((step, index) => (
                  <li
                    key={step.heading}
                    className="flex min-w-0 gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <span
                      aria-hidden="true"
                      className="font-bold text-cyan-200"
                    >
                      {index + 1}.
                    </span>
                    <span className="min-w-0">
                      <strong className="block text-white">
                        {step.heading}
                      </strong>
                      <span className="mt-1 block">{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-300">
              The $750 fee covers your Blueprint, not implementation. Payment is
              processed securely through Stripe. Implementation is optional and
              scoped separately. No revenue or savings are guaranteed.
            </p>
            <div
              className="mt-5 flex flex-wrap gap-4"
              data-testid="blueprint-offer-actions"
            >
              {paymentUrl ? (
                <button
                  type="button"
                  onClick={handlePurchase}
                  data-offer-id={automationBlueprintOfferAuthority.offerId}
                  className="smc-button smc-button-primary"
                >
                  Start My Blueprint — ${automationBlueprintPriceUsd}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleDiscussOpportunity}
                className="smc-button smc-button-secondary"
              >
                Talk With Ross First
              </button>
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleAdjustAnswers}
              className="text-sm font-medium text-slate-400 underline decoration-slate-500 underline-offset-4 hover:text-white"
            >
              Adjust My Answers
            </button>
          </div>
        </section>
      ) : null}

      {handoffError ? (
        <p role="alert" className="mt-4 text-sm text-red-300">
          Your brief could not be saved privately. Nothing was submitted; please
          try again in a browser that permits same-tab storage.
        </p>
      ) : null}
    </main>
  );
}
