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

const scrollIntoView = vi.fn();
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: scrollIntoView,
});
const matchMedia = vi.fn().mockReturnValue({ matches: false });
Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: matchMedia,
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
  routerPush.mockClear();
  scrollIntoView.mockClear();
  matchMedia.mockReset().mockReturnValue({ matches: false });
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

    expect(screen.getByRole("heading", { name: "Your biggest automation opportunity" })).toBeInTheDocument();
    expect(routerPush).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(automationIntakeStorageKey)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Discuss My Blueprint" }));

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
    fireEvent.click(screen.getByRole("button", { name: "Discuss My Blueprint" }));

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
    fireEvent.click(screen.getByRole("button", { name: "Discuss My Blueprint" }));

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
    fireEvent.click(screen.getByRole("button", { name: "Discuss My Blueprint" }));

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
    expect(preview?.primaryDiagnosis).toContain("home services");
    expect(preview?.primaryDiagnosis).toContain("lead response and missed-call follow-up");
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
    expect(preview?.primaryDiagnosis).toContain("professional services");
    expect(preview?.humanControls.join(" ")).toContain("responsible professional");
    expect(preview?.primaryDiagnosis).not.toContain("field schedules");
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
      expect(JSON.stringify(preview)).not.toMatch(/\bROI\b|guaranteed? (?:leads?|revenue|savings)|benchmark|\bscore\b|\d+%/i);
      expect(preview?.opportunities.length).toBeLessThanOrEqual(3);
      expect(preview?.valueMechanisms.length).toBeLessThanOrEqual(4);
    }
  });

  it.each([
    ["Lead response", "lead-response"],
    ["Estimate / quote follow-up", "estimate-follow-up"],
    ["Scheduling", "scheduling"],
    ["Repetitive data entry", "system-handoff"],
    ["Customer follow-up", "customer-follow-up"],
    ["E-commerce workflow", "ecommerce-exceptions"],
  ])("produces one primary diagnosis and system for %s", (improvement, expectedId) => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({ improvement, businessType: "Home Services" }),
    );

    expect(preview?.opportunities[0].id).toBe(expectedId);
    expect(preview?.primaryDiagnosis).toBeTruthy();
    expect(preview?.primaryConsequence).toBeTruthy();
    expect(preview?.currentWorkflowSteps.length).toBeGreaterThanOrEqual(3);
    expect(preview?.improvedWorkflowSteps.length).toBeGreaterThanOrEqual(4);
  });

  it("presents both validated workflow descriptions without changing the recommendation", () => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: "Lead response",
        businessType: "Home Services",
        currentWorkflow: "UNIQUE CURRENT: calls are written on a dispatch pad.",
        desiredWorkflow: "UNIQUE DESIRED: callbacks have an owner and visible outcome.",
      }),
    );

    expect(preview?.opportunities[0].id).toBe("lead-response");
    expect(preview?.currentWorkflowContext).toBe(
      "UNIQUE CURRENT: calls are written on a dispatch pad.",
    );
    expect(preview?.desiredWorkflowContext).toBe(
      "UNIQUE DESIRED: callbacks have an owner and visible outcome.",
    );
  });

  it("uses the deterministic fallback when one workflow description is missing", () => {
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: "Estimate / quote follow-up",
        currentWorkflow: "Estimates are checked from a shared list.",
      }),
    );

    expect(preview?.currentWorkflowContext).toBe("Estimates are checked from a shared list.");
    expect(preview?.desiredWorkflowContext).toMatch(/^Recommended outcome:/);
    expect(preview?.desiredWorkflowContext).toContain("Its status and due date are tracked");
  });

  it("keeps bounded Unicode workflow descriptions display-only", () => {
    const currentWorkflow = "🔧".repeat(automationWorkflowTextMaxLength + 20);
    const preview = buildAutomationOpportunityPreview(
      parseAutomationBrief({
        improvement: "Lead response",
        currentWorkflow,
        desiredWorkflow: "Move orders into an ecommerce exception queue",
      }),
    );

    expect(Array.from(preview?.currentWorkflowContext || "")).toHaveLength(
      automationWorkflowTextMaxLength,
    );
    expect(preview?.opportunities[0].id).toBe("lead-response");
  });

  it("renders markup-like workflow descriptions as plain text", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.change(screen.getByLabelText("What happens today?"), {
      target: { value: '<img src=x onerror="alert(1)"> CURRENT' },
    });
    fireEvent.change(screen.getByLabelText("What should happen instead?"), {
      target: { value: "<script>alert('desired')</script> DESIRED" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    expect(screen.getByText('<img src=x onerror="alert(1)"> CURRENT')).toBeInTheDocument();
    expect(screen.getByText("<script>alert('desired')</script> DESIRED")).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img[src='x']")).toBeNull();
  });

  it("submitting valid answers displays the preview", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("radio", { name: "Home Services" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Missed-call follow-up" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    expect(screen.getByRole("heading", { name: "Your biggest automation opportunity" })).toBeInTheDocument();
    expect(screen.getByTestId("primary-diagnosis")).toHaveTextContent("Inquiry acknowledgement and callback queue");
    expect(screen.getByTestId("recommended-system")).toHaveTextContent("Inquiry acknowledgement and callback queue");
    expect(screen.getByRole("heading", { name: "Current" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Improved" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Human-control requirements" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Four questions we confirm during the Blueprint" })).toBeInTheDocument();
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("renders at most two subordinate opportunities", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Scheduling" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Customer follow-up" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    const section = screen.getByRole("heading", { name: "Secondary opportunities" }).parentElement!;
    expect(section.querySelectorAll("article")).toHaveLength(2);
  });

  it("renders the complete Blueprint scope, delivery boundary, credit, and exclusions", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    const blueprint = screen.getByRole("heading", { name: "$750 Automation Opportunity Blueprint" }).parentElement!;
    for (const text of [
      "One 60–90 minute workflow interview",
      "A visual current-workflow map",
      "Identification of the primary breakdown or revenue-risk point",
      "Up to three ranked automation opportunities",
      "A detailed design for the highest-priority solution",
      "Required software and integrations",
      "Human-review and failure-handling requirements",
      "Estimated implementation range and ongoing software costs",
      "A 30-minute findings review",
      "A written implementation proposal",
      "The full $750 credited toward an approved implementation",
    ]) {
      expect(blueprint).toHaveTextContent(text);
    }
    expect(blueprint).toHaveTextContent("five-business-day delivery target begins after the workflow interview");
    expect(blueprint).toHaveTextContent("Implementation, software subscriptions, and third-party fees are not included");
    expect(blueprint).toHaveTextContent("No revenue or savings are guaranteed");
  });

  it("renders clear selected choices without changing semantic controls", () => {
    render(React.createElement(AutomatePage));
    const choice = screen.getByRole("radio", { name: /Home Services/ });
    fireEvent.click(choice);

    expect(choice).toBeChecked();
    expect(choice.closest("label")).toHaveClass("automate-choice");
    expect(choice.closest("label")).toHaveTextContent("Field and office teams coordinating inquiries");
  });

  it("focuses and reveals the primary preview heading", () => {
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    const heading = screen.getByRole("heading", { name: "Your biggest automation opportunity" });
    expect(heading).toHaveFocus();
    expect(heading).toHaveClass("automate-focus-target");
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("uses an immediate reveal and disables global smooth scrolling for reduced motion", () => {
    matchMedia.mockReturnValue({ matches: true });
    render(React.createElement(AutomatePage));
    fireEvent.click(screen.getByRole("checkbox", { name: "Lead response" }));
    fireEvent.click(screen.getByRole("button", { name: "Show My Opportunity" }));

    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: "auto", block: "start" });
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*html,[\s\S]*body\s*{[\s\S]*scroll-behavior:\s*auto/,
    );
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
    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });
    expect(window.location.search).toBe("");
  });
});
