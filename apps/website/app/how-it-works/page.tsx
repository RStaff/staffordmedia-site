export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        How Abando Works
      </h1>
      <ol className="mt-6 space-y-4 text-zinc-700">
        <li>
          <strong>Connect your platform</strong> — Shopify, WooCommerce,
          BigCommerce, Magento or custom via API.
        </li>
        <li>
          <strong>Pick timing windows</strong> — e.g., T+30m, T+24h, T+72h.
        </li>
        <li>
          <strong>Go live</strong> — automations run; you can step in on VIP
          carts anytime.
        </li>
        <li>
          <strong>Measure</strong> — attribution ties recovered revenue to
          messages.
        </li>
      </ol>
      <div className="mt-8">
        <a
          href="/signup"
          className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
