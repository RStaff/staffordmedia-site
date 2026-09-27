"use client";

import { useEffect, useState } from "react";
import {
  automationIntakeStorageKey,
  buildAutomationMailto,
  clearAutomationBrief,
  formatAutomationBrief,
  readAutomationBrief,
  type AutomationBrief,
} from "@/lib/automationIntake";
import { useStaffordMediaAnalytics } from "@/components/analytics/AnalyticsProvider";

export default function ContactPage() {
  const analytics = useStaffordMediaAnalytics();
  const [brief, setBrief] = useState<AutomationBrief | null>(null);
  const [copyError, setCopyError] = useState(false);
  const mailto = buildAutomationMailto(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "support@staffordmedia.ai",
    brief || {
      improvements: [],
      businessType: null,
      systems: [],
      currentWorkflow: "",
      desiredWorkflow: "",
      hasContent: false,
    },
  );

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.hash}`,
      );
    }
    try {
      const storage = window.sessionStorage;
      const storedValue = storage.getItem(automationIntakeStorageKey);
      const storedBrief = readAutomationBrief(storage);
      if (!storedBrief && storedValue !== null) {
        clearAutomationBrief(storage);
      }
      setBrief(storedBrief);
    } catch {
      setBrief(null);
    }
  }, []);

  async function copyBrief() {
    if (!brief) return;
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(formatAutomationBrief(brief));
    } catch {
      setCopyError(true);
    }
  }

  function removeBrief() {
    try {
      clearAutomationBrief(window.sessionStorage);
    } catch {
      // The visible brief can still be removed when browser storage becomes unavailable.
    }
    setBrief(null);
  }

  return (
    <main className="section-pad">
      <div className="site-shell max-w-3xl text-center">
        <p className="eyebrow text-[var(--smc-accent)]">Stafford Media Consulting</p>
        <h1 className="hero-title mt-5 text-white">
          Tell us what you want to improve
        </h1>
        <p className="body-lg mt-6">
          Tell us about a workflow, follow-up problem, or business process that
          is taking more time than it should.
        </p>

        {brief ? (
          <section
            aria-labelledby="submitted-brief-heading"
            className="premium-panel-soft mb-8 p-6 text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="submitted-brief-heading" className="text-xl font-semibold">
                Your submitted brief
              </h2>
              <button
                type="button"
                onClick={removeBrief}
                className="text-sm font-semibold text-slate-300 underline hover:text-white"
              >
                Remove saved brief
              </button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              {brief.improvements.length ? <div><dt className="font-semibold">Improve</dt><dd>{brief.improvements.join(", ")}</dd></div> : null}
              {brief.businessType ? <div><dt className="font-semibold">Business</dt><dd>{brief.businessType}</dd></div> : null}
              {brief.systems.length ? <div><dt className="font-semibold">Systems</dt><dd>{brief.systems.join(", ")}</dd></div> : null}
              {brief.currentWorkflow ? <div><dt className="font-semibold">Current workflow</dt><dd className="whitespace-pre-wrap">{brief.currentWorkflow}</dd></div> : null}
              {brief.desiredWorkflow ? <div><dt className="font-semibold">Desired workflow</dt><dd className="whitespace-pre-wrap">{brief.desiredWorkflow}</dd></div> : null}
            </dl>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {brief ? (
            <button
              type="button"
              onClick={copyBrief}
              className="smc-button smc-button-secondary"
            >
              Copy Brief
            </button>
          ) : null}
          {mailto ? (
            <a href={mailto} onClick={() => analytics.track("email_click")} className="smc-button smc-button-primary">
              Email Stafford Media
            </a>
          ) : null}
        </div>
        {copyError ? (
          <p role="alert" className="mt-4 text-sm text-red-300">
            The brief could not be copied automatically. Copy it manually, then use the email link.
          </p>
        ) : null}
        {brief ? (
          <p className="mt-4 text-sm text-slate-400">
            Copy your brief to paste into an email or booking form; it is not sent automatically.
          </p>
        ) : null}
        {brief && mailto ? (
          <p className="mt-2 text-sm text-slate-400">
            The email link contains coordination text only. Use Copy Brief, then paste the brief into your email if desired.
          </p>
        ) : null}
      </div>
    </main>
  );
}
