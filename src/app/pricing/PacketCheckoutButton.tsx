"use client";

import { useState } from "react";

type PacketCheckoutButtonProps = {
  storeDomain: string;
};

function getCheckoutApiBase() {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_CHECKOUT_API_BASE || "").trim();
  if (!configured) return "https://pay.abando.ai";
  return configured.replace(/\/$/, "");
}

export default function PacketCheckoutButton({ storeDomain }: PacketCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStartMyFix() {
    if (!storeDomain) {
      setError("Missing store context.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${getCheckoutApiBase()}/__public-checkout`, {
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

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(json?.message || json?.error || json?.code || `Checkout failed (${response.status})`);
      }

      const checkoutUrl = String(json?.url || json?.checkout_url || "").trim();
      if (!checkoutUrl) {
        throw new Error("Checkout response missing Stripe URL.");
      }

      window.location.assign(checkoutUrl);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Checkout failed.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleStartMyFix}
        disabled={isLoading}
        className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? "Starting..." : "Start My Fix"}
      </button>
      {error ? (
        <p className="mt-3 text-sm leading-6 text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
