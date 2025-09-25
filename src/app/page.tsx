"use client";
import Link from "next/link";
import AbandoTitle from "@/components/AbandoTitle";

export default function Page() {
  return (
    <main className="min-h-hero py-12 lg:py-16">
      <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left column */}
        <div data-testid="intro" className="order-1 lg:col-start-1">
          <AbandoTitle />
          <h1 className="text-white font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl mt-4">
            Unlock 4× ROI in 4 days—<br />no redesigns, no downtime.
          </h1>
          <p className="text-white/80 mt-6">
            Try Abando.ai free: cancel anytime.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              href="/start"
              className="inline-flex items-center px-6 py-3 rounded-lg font-semibold"
              style={{ background: "#FFE169", color: "#0A0F2A" }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-white/90 text-white hover:bg-white/5"
            >
              See Abando.ai In Action
            </Link>
          </div>
        </div>

        {/* Right column (cards) */}
        <div data-testid="cards" className="order-2 lg:col-start-2 flex flex-col gap-6">
          <div className="bg-white/5 rounded-2xl p-6 text-white/90">
            <h3 className="font-semibold text-white mb-3">Who it’s for</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ecommerce teams on Shopify, WooCommerce, BigCommerce, or custom carts.</li>
              <li>Marketers who want higher conversion without redesigns or long projects.</li>
              <li>Founders who need measurable ROI fast (days, not months).</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 text-white/90">
            <h3 className="font-semibold text-white mb-3">What it does</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI copilot that speaks in your brand’s voice — not a template.</li>
              <li>Engages via email, SMS, WhatsApp, push — wherever customers are.</li>
              <li>Handles objections in real time (price, shipping, trust).</li>
              <li>Installs with no redesigns, no downtime.</li>
              <li>Delivers measurable ROI in <strong>4 days — not weeks</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
