import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PacketCheckoutButton, { resolveCheckoutApiOrigin } from "./PacketCheckoutButton";

globalThis.React = React;

const checkoutUnavailableMessage = /checkout is temporarily unavailable\. please try again later\./i;
const validOrigin = "https://cart-agent-api.onrender.com";

function setCheckoutOrigin(value: string | undefined) {
  if (value === undefined) {
    delete process.env.NEXT_PUBLIC_SHOPIFIXER_CHECKOUT_API_BASE;
    return;
  }

  process.env.NEXT_PUBLIC_SHOPIFIXER_CHECKOUT_API_BASE = value;
}

function mockFailedCheckoutFetch() {
  const fetchMock = vi.fn(async () => ({
    ok: false,
    status: 503,
    json: async () => ({ message: "backend detail should stay hidden" }),
  })) as unknown as typeof fetch;

  vi.stubGlobal("fetch", fetchMock);
  return vi.mocked(fetchMock);
}

async function clickCheckout() {
  fireEvent.click(screen.getByRole("button", { name: /start my fix/i }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
}

describe("resolveCheckoutApiOrigin", () => {
  it("accepts an explicit HTTPS checkout origin", () => {
    expect(resolveCheckoutApiOrigin(validOrigin)).toBe(validOrigin);
  });

  it("normalizes a trailing slash", () => {
    expect(resolveCheckoutApiOrigin(`${validOrigin}/`)).toBe(validOrigin);
  });

  it("normalizes surrounding whitespace", () => {
    expect(resolveCheckoutApiOrigin(`  ${validOrigin}  `)).toBe(validOrigin);
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["malformed", "not a url"],
    ["http", "http://cart-agent-api.onrender.com"],
    ["credentials", "https://user:pass@cart-agent-api.onrender.com"],
    ["query", "https://cart-agent-api.onrender.com?fallback=1"],
    ["fragment", "https://cart-agent-api.onrender.com#checkout"],
  ])("rejects %s checkout authority", (_caseName, value) => {
    expect(resolveCheckoutApiOrigin(value)).toBeNull();
  });

  it("does not contain the historical checkout origin in the pricing implementation", () => {
    const source = readFileSync("src/app/pricing/PacketCheckoutButton.tsx", "utf8");
    const historicalOrigin = ["pay", "abando", "ai"].join(".");
    expect(source).not.toContain(historicalOrigin);
  });
});

describe("PacketCheckoutButton", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    setCheckoutOrigin(undefined);
  });

  it("posts to the configured checkout origin with the expected method and payload", async () => {
    setCheckoutOrigin(validOrigin);
    const fetchMock = mockFailedCheckoutFetch();

    render(<PacketCheckoutButton storeDomain="test-store.invalid" />);
    await clickCheckout();

    expect(fetchMock).toHaveBeenCalledWith(
      `${validOrigin}/__public-checkout`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ plan: "scale", store_domain: "test-store.invalid" }),
      }),
    );
  });

  it("uses one slash before the checkout path when the configured origin has a trailing slash", async () => {
    setCheckoutOrigin(`${validOrigin}/`);
    const fetchMock = mockFailedCheckoutFetch();

    render(<PacketCheckoutButton storeDomain="test-store.invalid" />);
    await clickCheckout();

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${validOrigin}/__public-checkout`);
  });

  it("uses the normalized origin when the configured value has surrounding whitespace", async () => {
    setCheckoutOrigin(`  ${validOrigin}  `);
    const fetchMock = mockFailedCheckoutFetch();

    render(<PacketCheckoutButton storeDomain="test-store.invalid" />);
    await clickCheckout();

    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${validOrigin}/__public-checkout`);
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["malformed", "not a url"],
    ["http", "http://cart-agent-api.onrender.com"],
    ["credentials", "https://user:pass@cart-agent-api.onrender.com"],
    ["query", "https://cart-agent-api.onrender.com?fallback=1"],
    ["fragment", "https://cart-agent-api.onrender.com#checkout"],
  ])("fails closed and does not fetch when checkout authority is %s", (_caseName, value) => {
    setCheckoutOrigin(value);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<PacketCheckoutButton storeDomain="test-store.invalid" />);
    fireEvent.click(screen.getByRole("button", { name: /start my fix/i }));

    expect(screen.getByRole("button", { name: /start my fix/i })).toBeDisabled();
    expect(screen.getByText(checkoutUnavailableMessage)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps fetch failures merchant-safe without rendering a success state", async () => {
    setCheckoutOrigin(validOrigin);
    mockFailedCheckoutFetch();

    render(<PacketCheckoutButton storeDomain="test-store.invalid" />);
    await clickCheckout();

    expect(screen.getByRole("alert")).toHaveTextContent("Checkout could not be started. Please try again later.");
    expect(screen.queryByText(/stripe url|backend detail|checkout session/i)).not.toBeInTheDocument();
  });
});
