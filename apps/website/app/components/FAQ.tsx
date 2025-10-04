const faqs = [
  {
    q: "Can I send manual messages?",
    a: "Yes. Automations run by default, and you can step in anytime for VIP carts to send live messages across channels.",
  },
  {
    q: "Which platforms are supported?",
    a: "Shopify, WooCommerce, BigCommerce, Magento, and custom carts via API/webhooks.",
  },
  {
    q: "How do you measure ROI?",
    a: "We attribute recovered revenue to flows and manual sends, so you see what works.",
  },
];
export default function FAQ() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-semibold text-zinc-950">
        Frequently asked questions
      </h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{f.q}</div>
            <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
