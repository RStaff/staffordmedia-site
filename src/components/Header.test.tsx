// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

globalThis.React = React;

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

afterEach(() => {
  cleanup();
  navigation.pathname = "/";
});

describe("product navigation", () => {
  it("closes the Products menu after a product navigation", async () => {
    render(<Header />);
    const summary = screen.getByText("Products");
    const details = summary.closest("details")!;

    fireEvent.click(summary);
    await waitFor(() => expect(details).toHaveAttribute("open"));
    const productLink = screen.getByRole("link", { name: "StaffordNext" });
    productLink.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(productLink);
    await waitFor(() => expect(details).not.toHaveAttribute("open"));
  });

  it("closes the Products menu after a client-side route change", async () => {
    const view = render(<Header />);
    const summary = screen.getByText("Products");
    const details = summary.closest("details")!;

    fireEvent.click(summary);
    await waitFor(() => expect(details).toHaveAttribute("open"));
    navigation.pathname = "/services";
    view.rerender(<Header />);
    await waitFor(() => expect(details).not.toHaveAttribute("open"));
  });

  it("uses the StaffordNext public label and route", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "StaffordNext" })).toHaveAttribute(
      "href",
      "/staffordnext",
    );
    expect(screen.queryByText("CareerOS")).not.toBeInTheDocument();
  });
});
