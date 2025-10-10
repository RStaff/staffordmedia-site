export default function Page() {
  return (
    <main>
      <div className="mb-3 text-xs">🏷️ Abando</div>

      <h1 className="text-3xl font-bold leading-tight">
        Unlock 4× ROI in 4 days—<br />no redesigns, no downtime.
      </h1>

      <p className="mt-4 text-zinc-700">
        Try Abando.ai free; cancel anytime.
      </p>

      <div className="mt-4 flex gap-4">
        <a href="/abando#start" className="rounded bg-amber-400 px-3 py-2 text-sm font-semibold hover:bg-amber-300">
          Start Free Trial
        </a>
        <a href="/demo" className="text-sm font-semibold text-indigo-600 hover:underline">
          See Abando.ai In Action
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Who it’s for</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Ecommerce teams on Shopify, WooCommerce, BigCommerce, or custom carts.</li>
          <li>Marketers who want higher conversion without redesigns or long projects.</li>
          <li>Founders who need measurable ROI fast (days, not months).</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">What it does</h2>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>An AI copilot that speaks in your brand’s voice — not a template.</li>
          <li>Engages via email, SMS, WhatsApp, push — wherever customers are.</li>
          <li>Handles objections in real time (price, shipping, trust).</li>
          <li>Installs with no redesigns, no downtime.</li>
          <li>Delivers measurable ROI in <strong>4 days</strong> — not weeks.</li>
        </ul>
      </section>
    </main>
  );
}
