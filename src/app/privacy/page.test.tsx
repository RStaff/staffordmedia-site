// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import PrivacyPage from "./page";

globalThis.React = React;

afterEach(cleanup);

describe("analytics privacy notice", () => {
  it("states purpose, provider, exclusions, consent, and withdrawal", () => {
    render(<PrivacyPage />);

    expect(screen.getByText(/Google Analytics only after you affirmatively accept/i)).toBeInTheDocument();
    expect(screen.getByText(/Page routes, allowed campaign attribution fields/i)).toBeInTheDocument();
    expect(screen.getByText(/do not send submitted names, email addresses, phone numbers/i)).toBeInTheDocument();
    expect(screen.getByText(/change or withdraw your choice/i)).toBeInTheDocument();
  });
});
