import Link from "next/link";
import { AbandoMark } from "./Brand";

type Variant = "roi" | "recover";
function headline(v: Variant) {
  if (v === "roi") return "4× ROI in 4 Weeks — Automated";
  return "Recover More Revenue. ROI Through Automation.";
}
function subhead() {
  return "Automated cart recovery on your schedule — with the option to jump in live anytime.";
}

export default function Hero({ variant }: { variant: Variant }) {
  return (
    <section className="bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
            <AbandoMark className="h-4 w-4" />
            <span>
              Abando — works with Shopify, WooCommerce, BigCommerce, Magento &
              more
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950">
            {headline(variant)}
          </h1>
          <p className="mt-4 text-zinc-600 max-w-xl">{subhead()}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-black"
            >
              Get Started
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-xl border px-5 py-3 text-sm font-medium"
            >
              See How It Works
            </Link>
          </div>
          <div className="mt-6 p-3 rounded-lg border text-xs text-zinc-600">
            <strong className="text-zinc-900">Manual messages, anytime.</strong>{" "}
            Automations do the heavy lifting; step in live on high-value carts
            across email/SMS/DM right from your dashboard.
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-sm text-zinc-900 font-medium">
            Projected Revenue Recovered
          </div>
          <div className="mt-2 h-36 rounded-xl bg-zinc-50 border grid place-items-center text-zinc-400">
            Chart placeholder
          </div>
          <ul className="mt-4 text-sm text-zinc-600 space-y-1">
            <li>• Automated outreach windows</li>
            <li>• Manual override on VIP carts</li>
            <li>• Clear attribution & ROI</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
