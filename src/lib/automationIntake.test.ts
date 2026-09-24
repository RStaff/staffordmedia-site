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
  buildAutomationOpportunityPreview,
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
    fireEvent.submit(screen.getByRole("button", { name: "Show My Opportunity" }).closest("form")!);

    expect(screen.getByText("Your first automation opportunity")).toBeInTheDocument();
    expect(routerPush).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(automationIntakeStorageKey)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Discuss This Opportunity" }));

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

    fireEvent.submit(screen.getByRole("button", { name: "Show My Opportunity" }).closest("form")!);
    fireEvent.click(screen.getByRole("button", { name: "Discuss This Opportunity" }));

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

    fireEvent.submit(screen.getByRole("button", { name: "Show My Opportunity" }).closest("form")!);
    fireEvent.click(screen.getByRole("button", { name: "Discuss This Opportunity" }));

    expect(routerPush).not.toHaveBeenCalled();
    expect(window.location.search).toBe("");
    expect(screen.getByRole("alert")).toHaveTextContent("Nothing was submitted");
  });

  it("fails closed when private navigation is unavailable", () => {
    routerPush.mockImplementationOnce(() => {
      throw new Error("navigation unavailable");
    });
    render(React.createElement(AutomatePage));

    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.submit(screen.getByRole("button", { name: "Show My Opportunity" }).closest("form")!);
    fireEvent.click(screen.getByRole("button", { name: "Discuss This Opportunity" }));

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

  it("recommends an inquiry and callback queue for home-services lead work", () => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: ["Lead response", "Missed-call follow-up"],
        businessType: "Home Services",
        system: ["Phone", "Email"],
      }),
    );

    expect(preview?.opportunities[0]).toMatchObject({
      id: "lead-response",
      title: "Inquiry acknowledgement and callback queue",
    });
    expect(preview?.whatWeSee).toContain("inquiries, callbacks, estimates, and field schedules");
  });

  it("uses materially different professional-services language", () => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: "Moving information between systems",
        businessType: "Professional Services",
        system: ["CRM", "Accounting / business software"],
      }),
    );

    expect(preview?.opportunities[0].id).toBe("system-handoff");
    expect(preview?.whatWeSee).toContain("professional-service handoffs");
    expect(preview?.humanControls.join(" ")).toContain("responsible professional");
    expect(preview?.whatWeSee).not.toContain("field schedules");
  });

  it("maps ecommerce work to an exception and customer-service queue", () => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: "E-commerce workflow",
        businessType: "E-commerce",
        system: "E-commerce platform",
      }),
    );

    expect(preview?.opportunities[0]).toMatchObject({
      id: "ecommerce-exceptions",
      title: "E-commerce exception and customer-service queue",
    });
    expect(preview?.humanControls.join(" ")).toContain("Store staff decide");
  });

  it("provides a bounded fallback for unsupported combinations", () => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: "Reporting",
        businessType: "Other",
      }),
    );

    expect(preview?.opportunities).toHaveLength(1);
    expect(preview?.opportunities[0].id).toBe("workflow-review");
    expect(preview?.assessmentQuestions).toHaveLength(4);
    expect(preview?.valueMechanisms.length).toBeLessThanOrEqual(4);
  });

  it("always preserves human control without ROI, guarantees, or scores", () => {
    const briefs = [
      parseAutomationBrief({ improvement: "Lead response", businessType: "Home Services" }),
      parseAutomationBrief({ improvement: "Customer follow-up", businessType: "Professional Services" }),
      parseAutomationBrief({ improvement: "Scheduling", businessType: "Automotive / Field Services" }),
      parseAutomationBrief({ improvement: "E-commerce workflow", businessType: "E-commerce" }),
      parseAutomationBrief({ improvement: "Something else", businessType: "Other" }),
    ];

    for (const brief of briefs) {
      const preview = buildAutomationOpportunityPreview(brief);
      expect(preview?.humanControls.length).toBeGreaterThan(0);
      expect(preview?.humanControls.join(" ").toLowerCase()).toMatch(/staff|team member/);
      expect(JSON.stringify(preview)).not.toMatch(/\bROI\b|guarantee|benchmark|\bscore\b|\d+%/i);
      expect(preview?.opportunities.length).toBeLessThanOrEqual(3);
    }
  });

  it("submitting valid answers displays the preview", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("radio", { name: "Home Services" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Missed-call follow-up" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    expect(screen.getByRole("heading", { name: "Inquiry acknowledgement and callback queue" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Human-control requirements" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we would confirm during assessment" })).toBeInTheDocument();
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("moves focus to the primary preview heading", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    expect(
      screen.getByRole("heading", { name: "Inquiry acknowledgement and callback queue" }),
    ).toHaveFocus();
  });

  it("restores the retained form and usable focus for adjustment", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Missed-call follow-up" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    fireEvent.click(screen.getByRole("button", { name: "Adjust My Answers" }));
    expect(screen.getByRole("checkbox", { name: "Missed-call follow-up" })).toBeChecked();
    expect(
      screen.getByRole("heading", { name: "What are you trying to improve?" }),
    ).toHaveFocus();
    expect(window.location.search).toBe("");
  });
});
