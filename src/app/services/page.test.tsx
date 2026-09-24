// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import Services from "./page";
import { campaignSegments } from "@/lib/campaignSegments";

globalThis.React = React;

afterEach(cleanup);

describe("services campaign segments", () => {
  it("keeps the prioritized and approved business groupings visible", () => {
    render(<Services />);

    for (const segment of campaignSegments) {
      expect(screen.getByRole("heading", { name: segment.name })).toBeInTheDocument();
    }

    expect(screen.getByText(/Plumbers, Electricians, HVAC/)).toBeInTheDocument();
    expect(screen.getByText(/Accounting, Bookkeeping, Insurance/)).toBeInTheDocument();
    expect(screen.getByText(/Local agencies, Remote agencies/)).toBeInTheDocument();
  });

  it("uses complete reusable content records with bounded automation opportunities", () => {
    expect(campaignSegments.map((segment) => segment.id)).toEqual([
      "home-and-field-services",
      "financial-services",
      "agencies-and-consultants",
      "automotive-and-mobile-services",
      "e-commerce",
      "other-workflow-heavy-businesses",
    ]);

    for (const segment of campaignSegments) {
      expect(segment.representativeBusinessTypes.length).toBeGreaterThan(0);
      expect(segment.costlyWorkflow).not.toBe("");
      expect(segment.automationOpportunities.length).toBeGreaterThanOrEqual(2);
      expect(segment.automationOpportunities.length).toBeLessThanOrEqual(3);
      expect(segment.valueMechanism).not.toBe("");
    }
  });

  it("sends every category CTA to the private intake without URL details", () => {
    render(<Services />);

    const categoryLinks = screen.getAllByRole("link", { name: "Discuss this workflow" });
    expect(categoryLinks).toHaveLength(campaignSegments.length);
    for (const link of categoryLinks) {
      expect(link).toHaveAttribute("href", "/automate");
      expect(link.getAttribute("href")).not.toContain("?");
      expect(link.getAttribute("href")).not.toContain("#");
    }
  });
});
