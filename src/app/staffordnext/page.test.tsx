// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import StaffordNextPage, { metadata } from "./page";

globalThis.React = React;

describe("StaffordNext public product page", () => {
  it("uses the StaffordNext public identity", () => {
    render(<StaffordNextPage />);

    expect(metadata.title).toBe("StaffordNext - Stafford Media Consulting");
    expect(screen.getByRole("heading", { level: 1, name: "StaffordNext" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discuss StaffordNext" })).toHaveAttribute("href", "/contact");
    expect(screen.queryByText(/CareerOS/)).not.toBeInTheDocument();
  });
});
