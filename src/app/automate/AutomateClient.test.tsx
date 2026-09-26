// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AutomateClient from "./AutomateClient";
import { setAnalyticsCollectionEnabled } from "@/lib/analytics";

globalThis.React = React;

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  track: vi.fn<(event: string) => boolean>(() => true),
  ready: true,
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("@/components/analytics/AnalyticsProvider", () => ({
  useStaffordMediaAnalytics: () => ({ consent: "accepted", ready: mocks.ready, track: mocks.track }),
}));

const livePaymentUrl = "https://buy.stripe.com/cNieVe5xW8fBg1V8xL00002";

function renderAutomate(navigateToCheckout = vi.fn<(destination: string) => void>()) {
  render(
    <AutomateClient
      paymentUrl={livePaymentUrl}
      paymentEnvironment="production"
      navigateToCheckout={navigateToCheckout}
    />,
  );
  return navigateToCheckout;
}

function completeAssessment() {
  fireEvent.click(screen.getByLabelText("Lead response"));
  fireEvent.click(screen.getByLabelText("Home Services"));
  fireEvent.change(screen.getByLabelText("What happens today?"), {
    target: { value: "PRIVATE CURRENT WORKFLOW" },
  });
  fireEvent.change(screen.getByLabelText("What should happen instead?"), {
    target: { value: "PRIVATE DESIRED WORKFLOW" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));
}

describe("automate funnel analytics", () => {
  beforeEach(() => {
    setAnalyticsCollectionEnabled(false);
    window.sessionStorage.clear();
    mocks.push.mockReset();
    mocks.track.mockReset().mockReturnValue(true);
    mocks.ready = true;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    setAnalyticsCollectionEnabled(false);
  });

  it("tracks view, first interaction once, and each valid result without form content", async () => {
    renderAutomate();
    await waitFor(() => expect(mocks.track).toHaveBeenCalledWith("automate_view"));

    fireEvent.click(screen.getByLabelText("Lead response"));
    fireEvent.click(screen.getByLabelText("Home Services"));
    fireEvent.change(screen.getByLabelText("What happens today?"), {
      target: { value: "PRIVATE WORKFLOW SENTINEL" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    await screen.findByRole("heading", { name: "Your biggest automation opportunity" });
    expect(mocks.track.mock.calls.filter(([event]) => event === "form_start")).toHaveLength(1);
    expect(mocks.track).toHaveBeenCalledWith("automation_result_view");
    expect(JSON.stringify(mocks.track.mock.calls)).not.toContain("PRIVATE WORKFLOW SENTINEL");
  });

  it("waits for analytics readiness and then tracks the automate view exactly once", async () => {
    mocks.ready = false;
    const props = {
      paymentUrl: livePaymentUrl,
      paymentEnvironment: "production" as const,
      navigateToCheckout: vi.fn<(destination: string) => void>(),
    };
    const { rerender } = render(<AutomateClient {...props} />);
    expect(mocks.track).not.toHaveBeenCalledWith("automate_view");

    mocks.ready = true;
    rerender(<AutomateClient {...props} />);
    await waitFor(() => expect(mocks.track).toHaveBeenCalledWith("automate_view"));
    rerender(<AutomateClient {...props} />);

    expect(mocks.track.mock.calls.filter(([event]) => event === "automate_view")).toHaveLength(1);
  });

  it("tracks successful private contact and checkout activations", async () => {
    const navigateToCheckout = renderAutomate();
    completeAssessment();
    await screen.findByRole("heading", { name: "Your biggest automation opportunity" });

    fireEvent.click(screen.getAllByRole("button", { name: "Talk With Ross First" })[0]);
    expect(mocks.track).toHaveBeenCalledWith("contact_click");
    expect(mocks.push).toHaveBeenCalledWith("/contact");

    fireEvent.click(screen.getAllByRole("button", { name: "Start My Blueprint — $750" })[0]);
    expect(navigateToCheckout).toHaveBeenCalledWith(livePaymentUrl);
    expect(navigateToCheckout.mock.calls[0][0]).not.toContain("PRIVATE");
  });

  it("keeps contact and checkout functional when the GA transport itself fails", async () => {
    const navigateToCheckout = renderAutomate();
    completeAssessment();
    await screen.findByRole("heading", { name: "Your biggest automation opportunity" });
    mocks.track.mockReturnValue(false);

    fireEvent.click(screen.getAllByRole("button", { name: "Talk With Ross First" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "Start My Blueprint — $750" })[0]);

    expect(mocks.push).toHaveBeenCalledWith("/contact");
    expect(navigateToCheckout).toHaveBeenCalledWith(livePaymentUrl);
  });

  it("waits for the checkout event callback before leaving for Stripe", async () => {
    const navigateToCheckout = renderAutomate();
    completeAssessment();
    await screen.findByRole("heading", { name: "Your biggest automation opportunity" });
    window.gtag = vi.fn();
    setAnalyticsCollectionEnabled(true);

    fireEvent.click(screen.getAllByRole("button", { name: "Start My Blueprint — $750" })[0]);

    expect(navigateToCheckout).not.toHaveBeenCalled();
    const payload = vi.mocked(window.gtag).mock.calls[0][2] as { event_callback: () => void };
    payload.event_callback();
    expect(navigateToCheckout).toHaveBeenCalledWith(livePaymentUrl);
  });
});
