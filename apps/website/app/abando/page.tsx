import Link from "next/link";

import { AbandoMark } from "../components/Brand";

export default function AbandoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
        <AbandoMark className="h-4 w-4" />
        <span>Abando — cart recovery</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">
        Unlock ROI Through Automation
      </h1>
      <p className="mt-3 text-zinc-700 max-w-2xl">
        Abando helps ecommerce teams recover revenue without redesigns or
        downtime. Set the schedule that fits your brand, then jump in live on
        high-value carts.
      </p>

      <ul className="mt-6 text-sm text-zinc-600 space-y-2">
        <li>• Automated recovery flows on your timetable</li>
        <li>• Jump in live for VIP carts (email/SMS/DM)</li>
        <li>• Proven playbooks: T+30m, T+24h, T+72h</li>
        <li>• Attribution: tie revenue to messages & discounts</li>
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium"
        >
          Start Free Trial
        </Link>
        <Link
          href="/how-it-works"
          className="rounded-xl border px-5 py-3 text-sm font-medium"
        >
          See How It Works
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4">
            <div className="font-medium">Shopify</div>
            <div className="text-xs text-zinc-500">One-click app install</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium">WooCommerce</div>
            <div className="text-xs text-zinc-500">Plugin + API</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium">BigCommerce</div>
            <div className="text-xs text-zinc-500">Storefront API</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-medium">Magento</div>
            <div className="text-xs text-zinc-500">Events + webhooks</div>
          </div>
          <div className="md:col-span-2 rounded-xl border p-4">
            <div className="font-medium">Custom carts</div>
            <div className="text-xs text-zinc-500">
              REST/GraphQL via webhooks
            </div>
            <div className="text-xs text-zinc-600 mt-3">
              Need another platform?{" "}
              <strong>We support custom carts via API/webhooks.</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
