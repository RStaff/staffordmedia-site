"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  analyticsConsentStorageKey,
  readStoredAnalyticsConsent,
  sanitizeAnalyticsPageLocation,
  setAnalyticsCollectionEnabled,
  staffordMediaGaMeasurementId,
  trackStaffordMediaEvent,
  type AnalyticsConsent,
  type StaffordMediaAnalyticsEvent,
} from "@/lib/analytics";

const googleAnalyticsScriptId = "staffordmedia-ga4";

type AnalyticsContextValue = {
  consent: AnalyticsConsent;
  track: (event: StaffordMediaAnalyticsEvent) => boolean;
};

const AnalyticsContext = createContext<AnalyticsContextValue>({
  consent: "undecided",
  track: () => false,
});

function clearGoogleAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=", 1)[0]?.trim();
    if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.staffordmedia.ai; SameSite=Lax`;
  }
}

function enableGoogleAnalytics() {
  window[`ga-disable-${staffordMediaGaMeasurementId}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("config", staffordMediaGaMeasurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  if (!document.getElementById(googleAnalyticsScriptId)) {
    const script = document.createElement("script");
    script.id = googleAnalyticsScriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${staffordMediaGaMeasurementId}`;
    document.head.appendChild(script);
  }
}

function disableGoogleAnalytics() {
  setAnalyticsCollectionEnabled(false);
  window[`ga-disable-${staffordMediaGaMeasurementId}`] = true;
  try {
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    clearGoogleAnalyticsCookies();
  } catch {
    // Analytics failure must never affect the site experience.
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent>("undecided");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferenceError, setPreferenceError] = useState(false);

  useEffect(() => {
    const stored = readStoredAnalyticsConsent(window.localStorage);
    setConsent(stored);
    setPreferencesOpen(stored === "undecided");
  }, []);

  useEffect(() => {
    if (consent !== "accepted") {
      disableGoogleAnalytics();
      return;
    }

    setAnalyticsCollectionEnabled(true);
    try {
      enableGoogleAnalytics();
    } catch {
      setAnalyticsCollectionEnabled(false);
    }
  }, [consent]);

  useEffect(() => {
    if (consent !== "accepted" || typeof window.gtag !== "function") return;
    const pageLocation = sanitizeAnalyticsPageLocation(window.location.href);
    if (!pageLocation) return;
    try {
      window.gtag("event", "page_view", {
        page_location: pageLocation,
        page_path: window.location.pathname,
      });
    } catch {
      // Page navigation remains independent of analytics availability.
    }
  }, [consent, pathname]);

  const saveConsent = useCallback((nextConsent: Exclude<AnalyticsConsent, "undecided">) => {
    setPreferenceError(false);
    try {
      window.localStorage.setItem(analyticsConsentStorageKey, nextConsent);
    } catch {
      disableGoogleAnalytics();
      setConsent("undecided");
      setPreferenceError(true);
      setPreferencesOpen(true);
      return;
    }
    if (nextConsent === "declined") disableGoogleAnalytics();
    setConsent(nextConsent);
    setPreferencesOpen(false);
  }, []);

  const contextValue = useMemo<AnalyticsContextValue>(
    () => ({ consent, track: trackStaffordMediaEvent }),
    [consent],
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
      {preferencesOpen ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-consent-heading"
          className="analytics-consent-panel"
        >
          <div>
            <h2 id="analytics-consent-heading" className="text-base font-semibold text-white">
              Optional website analytics
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Allow privacy-limited Google Analytics to measure page and funnel activity. Submitted workflow and customer details are never included.
            </p>
            <Link href="/privacy" className="mt-2 inline-flex text-sm font-semibold text-cyan-200 underline">
              Read the privacy notice
            </Link>
            {preferenceError ? (
              <p role="alert" className="mt-2 text-sm text-rose-200">
                Your preference could not be saved. Analytics remains off.
              </p>
            ) : null}
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => saveConsent("accepted")} className="smc-button smc-button-secondary">
              Accept analytics
            </button>
            <button type="button" onClick={() => saveConsent("declined")} className="smc-button smc-button-secondary">
              Decline analytics
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setPreferencesOpen(true)}
          className="analytics-preferences-button"
        >
          Analytics preferences
        </button>
      )}
    </AnalyticsContext.Provider>
  );
}

export function useStaffordMediaAnalytics() {
  return useContext(AnalyticsContext);
}
