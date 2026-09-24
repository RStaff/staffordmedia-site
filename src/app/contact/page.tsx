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

export default function ContactPage() {
  const [brief, setBrief] = useState<AutomationBrief | null>(null);
  const [copyError, setCopyError] = useState(false);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  let validCalendlyUrl: string | null = null;
  if (calendlyUrl) {
    try {
      const parsedCalendlyUrl = new URL(calendlyUrl);
      if (
        parsedCalendlyUrl.protocol === "https:" &&
        (parsedCalendlyUrl.hostname === "calendly.com" ||
          parsedCalendlyUrl.hostname.endsWith(".calendly.com"))
      ) {
        validCalendlyUrl = calendlyUrl;
      }
    } catch {
      validCalendlyUrl = null;
    }
  }
  const mailto = buildAutomationMailto(
    process.env.NEXT_PUBLIC_CONTACT_EMAIL,
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

  async function copyBriefAndBook() {
    if (!brief || !validCalendlyUrl) return;
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(formatAutomationBrief(brief));
      window.open(validCalendlyUrl, "_blank", "noopener,noreferrer");
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
    <main className="bg-white px-6 py-20 text-center text-gray-900">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Stafford Media Consulting
        </p>
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Tell us what you want to improve
        </h1>
        <p className="mb-8 text-lg md:text-xl">
          Tell us about a workflow, follow-up problem, or business process that
          is taking more time than it should.
        </p>

        {brief ? (
          <section
            aria-labelledby="submitted-brief-heading"
            className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="submitted-brief-heading" className="text-xl font-semibold">
                Your submitted brief
              </h2>
              <button
                type="button"
                onClick={removeBrief}
                className="text-sm font-semibold text-gray-600 underline hover:text-gray-900"
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

        <div className="flex flex-wrap justify-center gap-4">
          {validCalendlyUrl ? (
            brief ? (
              <>
                <button
                  type="button"
                  onClick={copyBriefAndBook}
                  className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Copy Brief &amp; Book Strategy Call
                </button>
                <a
                  href={validCalendlyUrl}
                  className="rounded border border-gray-400 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100"
                >
                  Book Without Copying
                </a>
              </>
            ) : (
              <a href={validCalendlyUrl} className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                Book a Strategy Call
              </a>
            )
          ) : (
            <div className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-600">
              Strategy call link is not configured locally
            </div>
          )}
          {mailto ? (
            <a href={mailto} className="rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800">
              Email Stafford Media
            </a>
          ) : (
            <div className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-600">
              Email contact is not configured locally
            </div>
          )}
        </div>
        {copyError ? (
          <p role="alert" className="mt-4 text-sm text-red-700">
            The brief could not be copied automatically. Copy it manually, then use the booking link.
          </p>
        ) : null}
        {brief && validCalendlyUrl ? (
          <p className="mt-4 text-sm text-gray-600">
            Your brief is copied for you to paste into Calendly; it is not sent automatically.
          </p>
        ) : null}
        {brief && mailto ? (
          <p className="mt-2 text-sm text-gray-600">
            The email link contains coordination text only. Use Copy Brief, then paste the brief into your email if desired.
          </p>
        ) : null}
      </div>
    </main>
  );
}
