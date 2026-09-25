// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  analyticsConsentStorageKey,
  readStoredAnalyticsConsent,
  sanitizeAnalyticsPageLocation,
  setAnalyticsCollectionEnabled,
  staffordMediaGaMeasurementId,
  trackStaffordMediaEvent,
} from "./analytics";

describe("privacy-safe analytics contract", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.gtag;
    delete window.dataLayer;
    setAnalyticsCollectionEnabled(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setAnalyticsCollectionEnabled(false);
  });

  it("preserves only bounded allowlisted UTM parameters", () => {
    expect(
      sanitizeAnalyticsPageLocation(
        "https://www.staffordmedia.ai/automate?utm_source=local&utm_medium=email&utm_campaign=fall&utm_content=cta&utm_term=automation&email=private%40example.com&workflow=secret#brief",
      ),
    ).toBe(
      "https://www.staffordmedia.ai/automate?utm_source=local&utm_medium=email&utm_campaign=fall&utm_content=cta&utm_term=automation",
    );
  });

  it("rejects malformed locations and removes control characters from campaign values", () => {
    expect(sanitizeAnalyticsPageLocation("not a url")).toBeNull();
    expect(
      sanitizeAnalyticsPageLocation("https://www.staffordmedia.ai/?utm_source=line%0Abreak&name=Ross"),
    ).toBe("https://www.staffordmedia.ai/?utm_source=linebreak");
  });

  it("does not emit before collection is enabled", () => {
    window.gtag = vi.fn();
    expect(trackStaffordMediaEvent("automate_view")).toBe(false);
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("emits only the fixed event payload and ignores extra call arguments", () => {
    window.gtag = vi.fn();
    setAnalyticsCollectionEnabled(true);

    (trackStaffordMediaEvent as (...args: unknown[]) => boolean)("blueprint_checkout_start", {
      name: "Private Person",
      email: "private@example.com",
      workflow: "private workflow",
      stripe_customer: "cus_private",
    });

    expect(window.gtag).toHaveBeenCalledWith("event", "blueprint_checkout_start", {
      route: "/automate",
      source: "blueprint_result",
      offer_id: "STAFFORDMEDIA_AUTOMATION_OPPORTUNITY_ASSESSMENT_V1",
      currency: "USD",
      value: 750,
    });
    expect(JSON.stringify(vi.mocked(window.gtag).mock.calls)).not.toMatch(
      /Private Person|private@example|private workflow|cus_private/,
    );
  });

  it("contains only the approved measurement ID", () => {
    expect(staffordMediaGaMeasurementId).toBe("G-WMKCPRSMLR");
  });

  it("fails harmlessly when the analytics transport throws", () => {
    window.gtag = vi.fn(() => {
      throw new Error("blocked");
    });
    setAnalyticsCollectionEnabled(true);

    expect(trackStaffordMediaEvent("contact_click")).toBe(false);
  });

  it("accepts only the versioned local consent values", () => {
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    expect(readStoredAnalyticsConsent(window.localStorage)).toBe("accepted");
    window.localStorage.setItem(analyticsConsentStorageKey, "declined");
    expect(readStoredAnalyticsConsent(window.localStorage)).toBe("declined");
    window.localStorage.setItem(analyticsConsentStorageKey, "yes");
    expect(readStoredAnalyticsConsent(window.localStorage)).toBe("undecided");
  });
});
