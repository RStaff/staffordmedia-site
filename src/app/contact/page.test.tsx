// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  automationIntakeStorageKey,
  formatAutomationBrief,
  parseAutomationBrief,
  storeAutomationBrief,
} from "@/lib/automationIntake";
import ContactPage from "./page";

globalThis.React = React;

describe("contact intake handoff", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState({}, "", "/contact");
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  });

  it("displays a revalidated session brief and preserves the email action", async () => {
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "hello@staffordmedia.ai";
    storeAutomationBrief(
      window.sessionStorage,
      parseAutomationBrief({
        improvement: ["Lead response", "Reporting"],
        businessType: "Professional Services",
        system: ["CRM", "Email"],
        currentWorkflow: "Manual follow-up",
        desiredWorkflow: "A reviewed response",
      }),
    );

    render(<ContactPage />);

    expect(await screen.findByRole("heading", { name: "Your submitted brief" })).toBeInTheDocument();
    expect(screen.getByText("Lead response, Reporting")).toBeInTheDocument();
    expect(screen.getByText("CRM, Email")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Stafford Media" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^mailto:hello@staffordmedia\.ai\?/),
    );
  });

  it("copies the validated brief before opening Calendly", async () => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "https://calendly.com/staffordmedia/strategy";
    const brief = parseAutomationBrief({ desiredWorkflow: "A reviewed response" });
    storeAutomationBrief(window.sessionStorage, brief);
    const events: string[] = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn(async (text: string) => {
          expect(text).toBe(formatAutomationBrief(brief));
          events.push("copy");
        }),
      },
    });
    vi.spyOn(window, "open").mockImplementation((url) => {
      expect(url).toBe("https://calendly.com/staffordmedia/strategy");
      events.push("open");
      return null;
    });

    render(<ContactPage />);
    fireEvent.click(await screen.findByRole("button", { name: "Copy Brief & Book Strategy Call" }));

    await waitFor(() => expect(events).toEqual(["copy", "open"]));
    expect(screen.getByText(/not sent automatically/i)).toBeInTheDocument();
  });

  it("clears the locally stored brief", async () => {
    storeAutomationBrief(
      window.sessionStorage,
      parseAutomationBrief({ currentWorkflow: "Manual follow-up" }),
    );
    render(<ContactPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Remove saved brief" }));

    expect(window.sessionStorage.getItem(automationIntakeStorageKey)).toBeNull();
    expect(screen.queryByRole("heading", { name: "Your submitted brief" })).not.toBeInTheDocument();
  });

  it("rejects legacy query intake and removes it from the visible URL", async () => {
    window.history.replaceState({}, "", "/contact?desiredWorkflow=private-details");
    render(<ContactPage />);

    await waitFor(() => expect(window.location.search).toBe(""));
    expect(screen.queryByText("private-details")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Your submitted brief" })).not.toBeInTheDocument();
  });

  it("rejects and clears unsafe or malformed session data", async () => {
    window.sessionStorage.setItem(
      automationIntakeStorageKey,
      JSON.stringify({ schema: "unknown", desiredWorkflow: "<script>alert(1)</script>" }),
    );
    const view = render(<ContactPage />);

    await waitFor(() => expect(window.sessionStorage.getItem(automationIntakeStorageKey)).toBeNull());
    expect(view.container.querySelector("script")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Your submitted brief" })).not.toBeInTheDocument();
  });
});
