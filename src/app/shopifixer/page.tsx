import Link from "next/link";
import { redirect } from "next/navigation";
import { assertValidPayload } from "@/lib/auditPayload";
import AbandoTitle from "@/components/AbandoTitle";
import ShopifixerLogo from "@/components/ShopifixerLogo";

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
    <main>
      <section className="section-pad">
        <div className="site-shell">
          <div className="premium-panel p-6 md:p-10">
            <div className="max-w-4xl">
              <p className="eyebrow text-[var(--smc-accent)]">A Stafford Media Consulting service</p>
              <div className="mt-6">
                <ShopifixerLogo className="h-auto w-full max-w-[320px]" priority />
              </div>
              <h1 className="mt-6 text-[clamp(42px,6vw,62px)] font-semibold tracking-[-0.04em] text-white">
                Find the clearest conversion leak in your store.
              </h1>
              <p className="body-lg mt-6 max-w-3xl">
                ShopiFixer is a service-led audit built to surface the strongest issue first, show the evidence behind
                the read, and make the next fix obvious.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              <Card
                label="What you get"
                value="Top issue, estimated upside, evidence, and the first recommended fix worth testing."
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

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="premium-panel-soft p-6">
                <p className="eyebrow text-slate-400">Run the audit</p>
                <form action={submitAudit} className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Store URL</span>
                    <input type="text" name="storeUrl" required placeholder="your-store.com" className="smc-field" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">Email</span>
                    <input type="email" name="email" required placeholder="you@store.com" className="smc-field" />
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                    <button type="submit" className="smc-button smc-button-primary">
                      Run ShopiFixer Audit
                    </button>
                    <Link href="/audit-result?store=elkeyecoffee.com" className="smc-button smc-button-secondary">
                      View Example Audit
                    </Link>
                  </div>
                </form>
              </div>

              <div className="premium-panel-soft p-6">
                <p className="eyebrow text-slate-400">What the read should do</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-semibold text-white">Evidence-backed issue framing</p>
                    <p className="body-md mt-2">
                      The goal is not to generate noise. It is to isolate the clearest issue and explain why it matters.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-semibold text-white">Commercially useful next step</p>
                    <p className="body-md mt-2">
                      Once the strongest issue is clear, the first fix becomes easier to prioritize and test.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 premium-panel-soft p-6 md:p-8">
              <p className="eyebrow text-slate-400">What comes next</p>
              <div className="mt-5">
                <AbandoTitle />
              </div>
              <p className="body-md mt-5 max-w-3xl">
                Once the top issue is clear, Abando helps recover revenue automatically across the shoppers who still
                hesitate or leave.
              </p>
              <div className="mt-6">
                <Link href="/services" className="smc-button smc-button-secondary">
                  See Recovery System
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="premium-panel-soft p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="mt-3 text-sm leading-7 text-white/85">{value}</p>
    </div>
  );
}
