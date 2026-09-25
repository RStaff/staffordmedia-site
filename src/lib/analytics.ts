export const staffordMediaGaMeasurementId = "G-WMKCPRSMLR" as const;
export const analyticsConsentStorageKey = "staffordmedia.analytics_consent.v1" as const;

export const staffordMediaAnalyticsEvents = [
  "automate_view",
  "form_start",
  "automation_result_view",
  "contact_click",
  "blueprint_checkout_start",
  "email_click",
] as const;

export type AnalyticsConsent = "accepted" | "declined" | "undecided";
export type StaffordMediaAnalyticsEvent = (typeof staffordMediaAnalyticsEvents)[number];

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const allowedUtmParameters = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const fixedEventParameters: Record<StaffordMediaAnalyticsEvent, Readonly<Record<string, string | number>>> = {
  automate_view: { route: "/automate" },
  form_start: { route: "/automate" },
  automation_result_view: { route: "/automate" },
  contact_click: { route: "/automate", source: "automation_result" },
  blueprint_checkout_start: {
    route: "/automate",
    source: "blueprint_result",
    offer_id: "STAFFORDMEDIA_AUTOMATION_OPPORTUNITY_ASSESSMENT_V1",
    currency: "USD",
    value: 750,
  },
  email_click: { route: "/contact", source: "contact_page" },
};

let collectionEnabled = false;

function boundedCampaignValue(value: string) {
  const withoutControls = Array.from(value)
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint >= 32 && codePoint !== 127;
    })
    .slice(0, 100)
    .join("")
    .trim();
  return withoutControls || null;
}

export function sanitizeAnalyticsPageLocation(input: string | URL) {
  let source: URL;
  try {
    source = input instanceof URL ? input : new URL(input);
  } catch {
    return null;
  }

  if (source.protocol !== "https:" && source.protocol !== "http:") return null;

  const query = new URLSearchParams();
  for (const parameter of allowedUtmParameters) {
    const value = source.searchParams.get(parameter);
    if (!value) continue;
    const bounded = boundedCampaignValue(value);
    if (bounded) query.set(parameter, bounded);
  }

  const serializedQuery = query.toString();
  return `${source.origin}${source.pathname}${serializedQuery ? `?${serializedQuery}` : ""}`;
}

export function setAnalyticsCollectionEnabled(enabled: boolean) {
  collectionEnabled = enabled;
}

export function isAnalyticsCollectionEnabled() {
  return collectionEnabled;
}

export function trackStaffordMediaEvent(event: StaffordMediaAnalyticsEvent) {
  if (!collectionEnabled || typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  try {
    window.gtag("event", event, { ...fixedEventParameters[event] });
    return true;
  } catch {
    return false;
  }
}

export function readStoredAnalyticsConsent(storage: Pick<Storage, "getItem">): AnalyticsConsent {
  try {
    const stored = storage.getItem(analyticsConsentStorageKey);
    return stored === "accepted" || stored === "declined" ? stored : "undecided";
  } catch {
    return "undecided";
  }
}
