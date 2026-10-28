"use client";

import { useState } from "react";

type PacketCheckoutButtonProps = {
  storeDomain: string;
};

const checkoutUnavailableMessage = "Checkout is temporarily unavailable. Please try again later.";
const checkoutFailedMessage = "Checkout could not be started. Please try again later.";

export function resolveCheckoutApiOrigin(
  configuredValue = process.env.NEXT_PUBLIC_SHOPIFIXER_CHECKOUT_API_BASE,
) {
  const configured = String(configuredValue || "").trim();
  if (!configured) return null;

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    return null;
  }

  return url.origin;
}

export default function PacketCheckoutButton({ storeDomain }: PacketCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const checkoutApiBase = resolveCheckoutApiOrigin();
  const isCheckoutAvailable = Boolean(checkoutApiBase);

  async function handleStartMyFix() {
    if (!checkoutApiBase) {
      setError(checkoutUnavailableMessage);
      return;
    }

    if (!storeDomain) {
      setError("Missing store context.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${checkoutApiBase}/__public-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          plan: "scale",
          store_domain: storeDomain,
        }),
      });

      if (!response.ok) {
        throw new Error(checkoutFailedMessage);
      }

      const json = await response.json().catch(() => null);
      const checkoutUrl = String(json?.url || json?.checkout_url || "").trim();
      if (!checkoutUrl) {
        throw new Error(checkoutFailedMessage);
      }

      window.location.assign(checkoutUrl);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : checkoutFailedMessage);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleStartMyFix}
        disabled={isLoading || !isCheckoutAvailable}
        aria-describedby={!isCheckoutAvailable ? "checkout-unavailable-message" : undefined}
        className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? "Starting..." : "Start My Fix"}
      </button>
      {!isCheckoutAvailable ? (
        <p id="checkout-unavailable-message" className="mt-3 text-sm leading-6 text-rose-300" role="status">
          {checkoutUnavailableMessage}
        </p>
      ) : error ? (
        <p className="mt-3 text-sm leading-6 text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
