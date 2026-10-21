import Link from "next/link";

export const metadata = {
  title: "ShopiFixer — Stafford Media Consulting™",
  description: "Fast audit-style Shopify conversion review with the clearest issue and first fix to test.",
};

export default function ShopifixerPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container-max max-w-5xl">
        <div className="rounded-3xl bg-white/5 p-8 md:p-10 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">ShopiFixer</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Find the clearest conversion leak in your Shopify store.
          </h1>
          <p className="mt-6 max-w-3xl text-white/80 text-lg leading-8">
            ShopiFixer is a service-led audit flow. The goal is simple: surface the strongest issue first,
            show the evidence behind the read, and make the next fix obvious.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card
              label="What you get"
              value="Top issue, estimated upside, evidence, and first recommended fix."
            />
            <Card
              label="How it works"
              value="Review the proof page, then request prioritized first fixes for your store."
            />
            <Card
              label="Best current examples"
              value="elkeyecoffee.com · luckettstore.com · dripaccessory.com"
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/audit-result?store=elkeyecoffee.com"
              className="inline-flex items-center rounded-lg px-5 py-3 font-semibold"
              style={{ background: "#FFE169", color: "#0A0F2A" }}
            >
              View Example Audit
            </Link>
            <a
              href="mailto:support@staffordmedia.ai?subject=ShopiFixer review request&body=Store:%20"
              className="inline-flex items-center rounded-lg px-5 py-3 font-semibold border border-white/20 text-white hover:bg-white/5"
            >
              Request Review by Email
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="mt-3 text-sm leading-7 text-white/85">{value}</p>
    </div>
  );
}
