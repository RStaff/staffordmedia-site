// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import AutomatePage from "@/app/automate/page";
import {
  automationWorkflowTextMaxLength,
  buildAutomationMailto,
  formatAutomationBrief,
  parseAutomationBrief,
} from "./automationIntake";

globalThis.React = React;

afterEach(cleanup);

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

  it("renders both workflow textareas with the shared maximum", () => {
    render(React.createElement(AutomatePage));

    expect(
      screen.getByRole("textbox", { name: "What happens today?" }),
    ).toHaveAttribute("maxLength", "500");
    expect(
      screen.getByRole("textbox", { name: "What should happen instead?" }),
    ).toHaveAttribute("maxLength", "500");
  });

  it("safely encodes the brief into a mailto action", () => {
    const brief = parseAutomationBrief({
      currentWorkflow: "Manual handoff & review",
      desiredWorkflow: "Confirm <script>alert(1)</script>",
    });
    const mailto = buildAutomationMailto("hello@staffordmedia.ai", brief);

    expect(mailto).toMatch(/^mailto:hello@staffordmedia\.ai\?/);
    expect(mailto).toContain("Manual%20handoff%20%26%20review");
    expect(mailto).toContain("%3Cscript%3Ealert(1)%3C%2Fscript%3E");
    expect(mailto).not.toContain("<script>");
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
});
