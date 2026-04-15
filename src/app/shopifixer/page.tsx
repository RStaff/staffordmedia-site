import Link from "next/link";
import { redirect } from "next/navigation";
import { assertValidPayload } from "@/lib/auditPayload";

export const metadata = {
  title: "ShopiFixer — Stafford Media Consulting™",
  description: "Fast audit-style Shopify conversion review with the clearest issue and first fix to test.",
};

function normalizeStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function getFixAuditUrl() {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL || "").trim();
  if (!configured) {
    return "https://app.abando.ai/api/fix-audit";
  }

  return configured.includes("/api/")
    ? configured
    : `${configured.replace(/\/$/, "")}/api/fix-audit`;
}

async function submitAudit(formData: FormData) {
  "use server";

  const storeUrl = normalizeStoreDomain(String(formData.get("storeUrl") || ""));
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!storeUrl || !email) {
    throw new Error("INVALID_AUDIT_REQUEST");
  }

  const response = await fetch(getFixAuditUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      storeUrl,
      email,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  const payload = assertValidPayload(json?.payload || json);

  redirect(`/audit-result?store=${encodeURIComponent(payload.store_domain)}`);
}

export default function ShopifixerPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container-max max-w-5xl">
        <div className="rounded-3xl bg-white/5 p-8 text-white md:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-white/60">ShopiFixer</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Find the clearest conversion leak in your Shopify store.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
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
              value="Submit your store and email, then review the same engine-backed audit result sent to your inbox."
            />
            <Card
              label="Best current examples"
              value="elkeyecoffee.com · luckettstore.com · dripaccessory.com"
            />
          </div>

          <form action={submitAudit} className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Store URL</span>
              <input
                type="text"
                name="storeUrl"
                required
                placeholder="your-store.com"
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-white/35"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@store.com"
                className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-white/35"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg px-5 py-3 font-semibold"
              style={{ background: "#FFE169", color: "#0A0F2A" }}
            >
              Run Audit
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/audit-result?store=elkeyecoffee.com"
              className="inline-flex items-center rounded-lg border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/5"
            >
              View Example Audit
            </Link>
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
