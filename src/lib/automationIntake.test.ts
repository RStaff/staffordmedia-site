// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import AutomatePage from "@/app/automate/page";
import {
  automationIntakeStorageKey,
  automationMailtoUriMaxLength,
  automationWorkflowTextMaxLength,
  buildAutomationMailto,
  clearAutomationBrief,
  formatAutomationBrief,
  parseAutomationBrief,
  readAutomationBrief,
  storeAutomationBrief,
} from "./automationIntake";

globalThis.React = React;

const routerPush = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: routerPush }) }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
  routerPush.mockClear();
});

describe("automation intake", () => {
  it("routes the homepage automation CTA directly to the intake", () => {
    const source = readFileSync("src/components/site/FinalCta.tsx", "utf8");
    expect(source).toMatch(/href="\/automate"[\s\S]*Automate My Business/);
  });

  it("accepts recognized intake values", () => {
    const brief = parseAutomationBrief({
      improvement: "Lead response",
      businessType: "Professional Services",
      system: "CRM",
      currentWorkflow: "Leads wait for a manual reply.",
      desiredWorkflow: "Send a reviewed response promptly.",
    });

    expect(brief).toMatchObject({
      improvements: ["Lead response"],
      businessType: "Professional Services",
      systems: ["CRM"],
      hasContent: true,
    });
  });

  it("preserves multiple recognized selections without duplicates", () => {
    const brief = parseAutomationBrief({
      improvement: ["Reporting", "Lead response", "Reporting"],
      system: ["Email", "CRM", "Email"],
    });

    expect(brief.improvements).toEqual(["Lead response", "Reporting"]);
    expect(brief.systems).toEqual(["CRM", "Email"]);
  });

  it("bounds each workflow field at the shared maximum", () => {
    const brief = parseAutomationBrief({
      currentWorkflow: "c".repeat(automationWorkflowTextMaxLength + 25),
      desiredWorkflow: "d".repeat(automationWorkflowTextMaxLength + 25),
    });

    expect(brief.currentWorkflow).toHaveLength(500);
    expect(brief.desiredWorkflow).toHaveLength(500);
  });

  it("truncates workflow text by Unicode code point without malformed encoding", () => {
    const brief = parseAutomationBrief({
      currentWorkflow: `${"a".repeat(499)}😀extra`,
      desiredWorkflow: `${"😀".repeat(501)}`,
    });

    expect(Array.from(brief.currentWorkflow)).toHaveLength(500);
    expect(brief.currentWorkflow.endsWith("😀")).toBe(true);
    expect(Array.from(brief.desiredWorkflow)).toHaveLength(500);
    expect(() => buildAutomationMailto("hello@staffordmedia.ai", brief)).not.toThrow();
  });

  it("renders both workflow textareas with the shared maximum", () => {
    render(React.createElement(AutomatePage));

    expect(
      screen.getByRole("textbox", { name: "What happens today?" }),
    ).toHaveAttribute("maxLength", "500");
    expect(
      screen.getByRole("textbox", { name: "What should happen instead?" }),
    ).toHaveAttribute("maxLength", "500");
  });

  it("renders a non-GET form with intake unavailable before hydration", () => {
    const markup = renderToStaticMarkup(React.createElement(AutomatePage));

    expect(markup).toMatch(/<form[^>]*action="\/automate"/);
    expect(markup).toMatch(/<form[^>]*method="post"/);
    expect(markup).not.toMatch(/<form[^>]*method="get"/);
    expect(markup).toMatch(/<fieldset[^>]*disabled=""/);
  });

  it("stores normalized intake in same-tab state and navigates without a query", () => {
    render(React.createElement(AutomatePage));

    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.change(screen.getByRole("textbox", { name: "What happens today?" }), {
      target: { value: "Manual follow-up" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Continue to Contact" }).closest("form")!);

    expect(routerPush).toHaveBeenCalledWith("/contact");
    expect(routerPush.mock.calls[0][0]).not.toContain("?");
    expect(readAutomationBrief(window.sessionStorage)).toMatchObject({
      improvements: ["Lead response"],
      currentWorkflow: "Manual follow-up",
    });
  });

  it("fails closed when session storage rejects the draft", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    render(React.createElement(AutomatePage));
    fireEvent.change(screen.getByRole("textbox", { name: "What happens today?" }), {
      target: { value: "Private workflow details" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Continue to Contact" }).closest("form")!);

    expect(routerPush).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Nothing was submitted");
  });

  it("fails closed without exposing intake when session storage is unavailable", () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new DOMException("unavailable", "SecurityError");
    });
    render(React.createElement(AutomatePage));
    fireEvent.change(screen.getByRole("textbox", { name: "What happens today?" }), {
      target: { value: "Private workflow details" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Continue to Contact" }).closest("form")!);

    expect(routerPush).not.toHaveBeenCalled();
    expect(window.location.search).toBe("");
    expect(screen.getByRole("alert")).toHaveTextContent("Nothing was submitted");
  });

  it("fails closed when private navigation is unavailable", () => {
    routerPush.mockImplementationOnce(() => {
      throw new Error("navigation unavailable");
    });
    render(React.createElement(AutomatePage));

    fireEvent.submit(screen.getByRole("button", { name: "Continue to Contact" }).closest("form")!);

    expect(routerPush).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert")).toHaveTextContent("Nothing was submitted");
  });

  it("revalidates stored intake and clears it explicitly", () => {
    const brief = parseAutomationBrief({ desiredWorkflow: "Reviewed response" });
    storeAutomationBrief(window.sessionStorage, brief);

    expect(readAutomationBrief(window.sessionStorage)).toEqual(brief);
    clearAutomationBrief(window.sessionStorage);
    expect(window.sessionStorage.getItem(automationIntakeStorageKey)).toBeNull();
  });

  it("rejects malformed or noncanonical session data", () => {
    window.sessionStorage.setItem(
      automationIntakeStorageKey,
      JSON.stringify({ schema: "wrong", desiredWorkflow: "javascript:alert(1)" }),
    );

    expect(readAutomationBrief(window.sessionStorage)).toBeNull();
  });

  it("keeps workflow descriptions out of the bounded mailto action", () => {
    const brief = parseAutomationBrief({
      currentWorkflow: "CURRENT_WORKFLOW_UNIQUE_SENTINEL",
      desiredWorkflow: "DESIRED_WORKFLOW_UNIQUE_SENTINEL",
    });
    const mailto = buildAutomationMailto("hello@staffordmedia.ai", brief);

    expect(mailto).toMatch(/^mailto:hello@staffordmedia\.ai\?/);
    expect(decodeURIComponent(mailto || "")).not.toContain("CURRENT_WORKFLOW_UNIQUE_SENTINEL");
    expect(decodeURIComponent(mailto || "")).not.toContain("DESIRED_WORKFLOW_UNIQUE_SENTINEL");
    expect(mailto?.length).toBeLessThanOrEqual(automationMailtoUriMaxLength);
  });

  it("ignores missing, unknown, and unrecognized values", () => {
    const brief = parseAutomationBrief({
      improvement: "Unknown improvement",
      businessType: "Unknown business",
      system: "Unknown system",
      unexpected: "ignored",
    });

    expect(brief.hasContent).toBe(false);
    expect(formatAutomationBrief(brief)).toBe("Automation brief");
    expect(buildAutomationMailto("hello@staffordmedia.ai", brief)).toBe(
      "mailto:hello@staffordmedia.ai",
    );
  });

  it("rejects invalid email authorities and never creates executable URLs", () => {
    const brief = parseAutomationBrief({ desiredWorkflow: "javascript:alert(1)" });

    expect(buildAutomationMailto("javascript:alert(1)@", brief)).toBeNull();
    expect(buildAutomationMailto("hello@staffordmedia.ai", brief)).toMatch(
      /^mailto:/,
    );
  });

  it.each([
    "hello?bcc=attacker@example.net",
    "hello#fragment@example.net",
    "hello&header@example.net",
    "hello%25@example.net",
    "hello@example.net\r\nBcc:attacker@example.net",
    "hello@example.net,attacker@example.net",
    "hello@example.net;attacker@example.net",
    "missing-at.example.net",
    "two@@example.net",
    ".leading@example.net",
    "trailing.@example.net",
    "double..dot@example.net",
    "hello@-example.net",
    "hello@example",
  ])("rejects invalid configured contact address: %s", (email) => {
    const brief = parseAutomationBrief({ desiredWorkflow: "Reviewed response 😀" });
    expect(buildAutomationMailto(email, brief)).toBeNull();
  });

  it("bounds the mailto for worst-case validated Unicode brief content", () => {
    const brief = parseAutomationBrief({
      currentWorkflow: "😀".repeat(automationWorkflowTextMaxLength),
      desiredWorkflow: "😀".repeat(automationWorkflowTextMaxLength),
    });
    const mailto = buildAutomationMailto("hello+strategy@staffordmedia.ai", brief);

    expect(mailto).toMatch(/^mailto:hello\+strategy@staffordmedia\.ai\?/);
    expect(mailto?.length).toBeLessThanOrEqual(automationMailtoUriMaxLength);
    expect(mailto).not.toContain(encodeURIComponent("😀"));
  });
});
