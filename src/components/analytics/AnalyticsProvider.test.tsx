// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  analyticsConsentStorageKey,
  staffordMediaGaMeasurementId,
} from "@/lib/analytics";
import { AnalyticsProvider, useStaffordMediaAnalytics } from "./AnalyticsProvider";

globalThis.React = React;

vi.mock("next/navigation", () => ({ usePathname: () => window.location.pathname }));

function EventProbe() {
  const analytics = useStaffordMediaAnalytics();
  return (
    <button type="button" onClick={() => analytics.track("contact_click")}>
      Probe event
    </button>
  );
}

function ConsentProbe() {
  const analytics = useStaffordMediaAnalytics();
  return <output data-testid="consent-state">{analytics.consent}:{String(analytics.ready)}</output>;
}

function AutomateViewProbe() {
  const analytics = useStaffordMediaAnalytics();
  const tracked = React.useRef(false);

  React.useEffect(() => {
    if (analytics.consent === "accepted" && analytics.ready && !tracked.current) {
      tracked.current = analytics.track("automate_view");
    }
  }, [analytics]);

  return null;
}

describe("analytics consent provider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.history.replaceState(
      {},
      "",
      "/automate?utm_source=local&utm_campaign=blueprint&email=private%40example.com#private",
    );
    document.getElementById("staffordmedia-ga4")?.remove();
    delete window.gtag;
    delete window.dataLayer;
    delete window[`ga-disable-${staffordMediaGaMeasurementId}`];
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.getElementById("staffordmedia-ga4")?.remove();
  });

  it("loads no script and emits no event before consent", async () => {
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);

    expect(await screen.findByRole("dialog", { name: "Optional website analytics" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Probe event" }));

    expect(document.getElementById("staffordmedia-ga4")).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  it("keeps analytics off after decline", async () => {
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    fireEvent.click(await screen.findByRole("button", { name: "Decline analytics" }));

    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBe("declined");
    expect(document.getElementById("staffordmedia-ga4")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Probe event" }));
    expect(window.gtag).toBeUndefined();
  });

  it("loads the exact approved tag only after acceptance and sanitizes page location", async () => {
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    expect(document.getElementById("staffordmedia-ga4")).toBeNull();

    fireEvent.click(await screen.findByRole("button", { name: "Accept analytics" }));

    await waitFor(() => expect(document.getElementById("staffordmedia-ga4")).not.toBeNull());
    const script = document.getElementById("staffordmedia-ga4") as HTMLScriptElement;
    expect(script.src).toBe(
      `https://www.googletagmanager.com/gtag/js?id=${staffordMediaGaMeasurementId}`,
    );
    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBe("accepted");
    expect(window.dataLayer).toContainEqual([
      "config",
      staffordMediaGaMeasurementId,
      {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      },
    ]);
    expect(window.dataLayer).toContainEqual([
      "event",
      "page_view",
      {
        page_location: "http://localhost:3000/automate?utm_source=local&utm_campaign=blueprint",
        page_path: "/automate",
      },
    ]);
  });

  it("emits the automate view exactly once after stored consent restores and transport becomes ready", async () => {
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    render(<AnalyticsProvider><AutomateViewProbe /></AnalyticsProvider>);

    await waitFor(() => expect(window.dataLayer).toContainEqual([
      "event",
      "automate_view",
      { route: "/automate" },
    ]));
    expect(window.dataLayer?.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event" && entry[1] === "automate_view",
    )).toHaveLength(1);
  });

  it("withdrawal disables all future event collection", async () => {
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    fireEvent.click(await screen.findByRole("button", { name: "Accept analytics" }));
    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));

    fireEvent.click(screen.getByRole("button", { name: "Probe event" }));
    expect(window.dataLayer).toContainEqual([
      "event",
      "contact_click",
      { route: "/automate", source: "automation_result" },
    ]);
    const eventCountBeforeWithdrawal = window.dataLayer?.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event" && entry[1] === "contact_click",
    ).length;

    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    fireEvent.click(screen.getByRole("button", { name: "Decline analytics" }));
    fireEvent.click(screen.getByRole("button", { name: "Probe event" }));

    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);
    expect(window.dataLayer?.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event" && entry[1] === "contact_click",
    )).toHaveLength(eventCountBeforeWithdrawal || 0);
  });

  it("uses a consent update when analytics is accepted after withdrawal", async () => {
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    fireEvent.click(await screen.findByRole("button", { name: "Accept analytics" }));
    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));

    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    fireEvent.click(screen.getByRole("button", { name: "Decline analytics" }));
    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    fireEvent.click(screen.getByRole("button", { name: "Accept analytics" }));

    await waitFor(() => expect(window.dataLayer).toContainEqual([
      "consent",
      "update",
      {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]));
  });

  it("does not restore an older acceptance after a failed withdrawal write", async () => {
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    const view = render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    fireEvent.click(screen.getByRole("button", { name: "Decline analytics" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Analytics remains off");
    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBeNull();
    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);
    view.unmount();
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    expect(await screen.findByRole("dialog", { name: "Optional website analytics" })).toBeInTheDocument();
    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);
  });

  it("keeps a tab withdrawn if local preference writes and removal both fail", async () => {
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    const view = render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));
    const originalSetItem = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (this === window.localStorage) throw new DOMException("denied", "SecurityError");
      return Reflect.apply(originalSetItem, this, [key, value]);
    });
    vi.spyOn(window.localStorage, "removeItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    fireEvent.click(screen.getByRole("button", { name: "Analytics preferences" }));
    fireEvent.click(screen.getByRole("button", { name: "Decline analytics" }));
    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);
    view.unmount();
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    expect(await screen.findByRole("button", { name: "Analytics preferences" })).toBeInTheDocument();
    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);
  });

  it("broadcasts failed withdrawal so another open tab stops collection", async () => {
    class TestChannel {
      static instances: TestChannel[] = [];
      onmessage: ((event: MessageEvent) => void) | null = null;
      constructor(_name: string) { TestChannel.instances.push(this); }
      postMessage(message: string) {
        for (const peer of TestChannel.instances) {
          if (peer !== this) peer.onmessage?.({ data: message } as MessageEvent);
        }
      }
      close() {}
    }
    vi.stubGlobal("BroadcastChannel", TestChannel);
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    render(<AnalyticsProvider><ConsentProbe /></AnalyticsProvider>);
    render(<AnalyticsProvider><ConsentProbe /></AnalyticsProvider>);
    await waitFor(() => expect(screen.getAllByTestId("consent-state")).toHaveLength(2));
    await waitFor(() => expect(screen.getAllByTestId("consent-state")[1]).toHaveTextContent("accepted:true"));

    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (this === window.localStorage) throw new DOMException("denied", "SecurityError");
      return Reflect.apply(originalSetItem, this, [key, value]);
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(function (this: Storage, key) {
      if (this === window.localStorage) throw new DOMException("denied", "SecurityError");
      return Reflect.apply(originalRemoveItem, this, [key]);
    });

    fireEvent.click(screen.getAllByRole("button", { name: "Analytics preferences" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Decline analytics" }));

    expect(window.localStorage.getItem(analyticsConsentStorageKey)).toBe("accepted");
    expect(screen.getAllByTestId("consent-state")[1]).toHaveTextContent("declined:false");
    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);

    vi.restoreAllMocks();
    window.localStorage.setItem(analyticsConsentStorageKey, "declined");
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    fireEvent(window, new StorageEvent("storage", {
      key: analyticsConsentStorageKey,
      oldValue: "declined",
      newValue: "accepted",
      storageArea: window.localStorage,
    }));
    await waitFor(() => expect(screen.getAllByTestId("consent-state")[1]).toHaveTextContent("accepted:true"));
  });

  it("stops collection when another tab withdraws consent", async () => {
    window.localStorage.setItem(analyticsConsentStorageKey, "accepted");
    render(<AnalyticsProvider><EventProbe /></AnalyticsProvider>);
    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));

    window.localStorage.setItem(analyticsConsentStorageKey, "declined");
    fireEvent(window, new StorageEvent("storage", {
      key: analyticsConsentStorageKey,
      oldValue: "accepted",
      newValue: "declined",
      storageArea: window.localStorage,
    }));
    const count = window.dataLayer?.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event" && entry[1] === "contact_click",
    ).length;
    fireEvent.click(screen.getByRole("button", { name: "Probe event" }));
    expect(window.dataLayer?.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event" && entry[1] === "contact_click",
    )).toHaveLength(count || 0);
    expect(window[`ga-disable-${staffordMediaGaMeasurementId}`]).toBe(true);
  });

  it("fails closed when local preference storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    render(<AnalyticsProvider><span>Site remains usable</span></AnalyticsProvider>);

    fireEvent.click(await screen.findByRole("button", { name: "Accept analytics" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Analytics remains off");
    expect(screen.getByText("Site remains usable")).toBeInTheDocument();
    expect(document.getElementById("staffordmedia-ga4")).toBeNull();
  });
});
