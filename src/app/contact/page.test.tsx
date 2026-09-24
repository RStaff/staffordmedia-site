// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import ContactPage from "./page";

globalThis.React = React;

describe("contact intake handoff", () => {
  afterEach(() => {
    cleanup();
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  });

  it("displays a validated brief and preserves the configured Calendly action", async () => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "https://calendly.com/staffordmedia/strategy";
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "hello@staffordmedia.ai";
    const page = await ContactPage({
      searchParams: Promise.resolve({
        improvement: ["Lead response", "Reporting"],
        businessType: "Professional Services",
        system: ["CRM", "Email"],
        currentWorkflow: "Manual follow-up",
        desiredWorkflow: "A reviewed response",
      }),
    });

    render(page);

    expect(screen.getByRole("heading", { name: "Your submitted brief" })).toBeInTheDocument();
    expect(screen.getByText("Lead response, Reporting")).toBeInTheDocument();
    expect(screen.getByText("CRM, Email")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book a Strategy Call" })).toHaveAttribute(
      "href",
      "https://calendly.com/staffordmedia/strategy",
    );
    expect(screen.getByRole("link", { name: "Email Stafford Media" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^mailto:hello@staffordmedia\.ai\?/),
    );
  });

  it("renders submitted text without creating untrusted markup or executable links", async () => {
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "hello@staffordmedia.ai";
    const page = await ContactPage({
      searchParams: Promise.resolve({
        currentWorkflow: '<img src=x onerror="alert(1)">',
        desiredWorkflow: "javascript:alert(1)",
      }),
    });
    const view = render(page);

    expect(view.container.querySelector("img")).toBeNull();
    expect(view.container.querySelector("script")).toBeNull();
    for (const link of view.container.querySelectorAll("a")) {
      expect(link.getAttribute("href")).not.toMatch(/^javascript:/i);
    }
  });
});
