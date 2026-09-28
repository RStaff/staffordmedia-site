"use client";

import { useEffect, useRef, useState } from "react";
import { buildInquiryPayload } from "@/lib/automationInquiry";
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
  const submissionIdRef = useRef<string | null>(null);
  const [captureState, setCaptureState] = useState<"idle" | "saving" | "received" | "failed">("idle");
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

  async function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brief) return;
    setCaptureState("saving");
    const form = new FormData(event.currentTarget);
    const submissionId = submissionIdRef.current || `web_${crypto.randomUUID()}`;
    submissionIdRef.current = submissionId;
    const payload = buildInquiryPayload(brief, {
      submissionId,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      companyName: String(form.get("companyName") || ""),
      contactAcknowledgement: form.get("contactAcknowledgement") === "yes",
    });
    try {
      const response = await fetch("/api/automation-inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("capture failed");
      setCaptureState("received");
    } catch {
      setCaptureState("failed");
    }
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
        {brief ? (
          <form onSubmit={submitInquiry} onChange={() => { if (captureState !== "saving") { submissionIdRef.current = null; setCaptureState("idle"); } }} className="premium-panel-soft mt-8 grid gap-4 p-6 text-left" aria-labelledby="inquiry-heading">
            <h2 id="inquiry-heading" className="text-xl font-semibold text-white">Talk With Ross First</h2>
            <p className="text-sm text-slate-400">Save this brief for human review. No automated email or qualification is created.</p>
            <input className="smc-field" name="name" placeholder="Your name" maxLength={200} />
            <input className="smc-field" name="companyName" placeholder="Company (optional)" maxLength={200} />
            <input className="smc-field" name="email" type="email" required placeholder="Email" maxLength={254} />
            <input className="smc-field" name="phone" placeholder="Phone (optional)" maxLength={40} />
            <label className="text-sm text-slate-300"><input type="checkbox" name="contactAcknowledgement" value="yes" required className="mr-2" />I agree Stafford Media may contact me about this inquiry.</label>
            <button disabled={captureState === "saving" || captureState === "received"} type="submit" className="smc-button smc-button-primary">{captureState === "saving" ? "Saving…" : captureState === "received" ? "Received for review" : "Submit for review"}</button>
            {captureState === "failed" ? <p role="alert" className="text-sm text-red-300">We could not confirm receipt. Your inquiry may have been saved; retry this submission or use the email option above.</p> : null}
          </form>
        ) : null}
      </div>
    </main>
  );
}
