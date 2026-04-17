import Link from "next/link";
import { AuditPayload, assertValidPayload } from "@/lib/auditPayload";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ store?: string }>;
};

function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function getFixAuditUrl(store: string) {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL || "").trim();
  const base = configured
    ? configured.includes("/api/")
      ? configured
      : `${configured.replace(/\/$/, "")}/api/fix-audit`
    : "https://app.abando.ai/api/fix-audit";

  return `${base}?store=${encodeURIComponent(store)}`;
}

async function fetchAuditPayload(store: string): Promise<AuditPayload> {
  const response = await fetch(getFixAuditUrl(store), {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  return assertValidPayload(json?.payload || json);
}

function getStripeFixUrl(store: string) {
  const base = String(process.env.NEXT_PUBLIC_SHOPIFIXER_FIX_CHECKOUT_URL || "").trim();
  if (!base) return "#";
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}store=${encodeURIComponent(store)}`;
}

export default async function FixPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");

  if (!store) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-900/40 bg-red-950/30 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">Missing store</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">No store was provided.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Open this page with <code>?store=your-store.com</code>.
          </p>
          <div className="mt-6">
            <Link
              href="/shopifixer"
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Go to ShopiFixer
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const payload = await fetchAuditPayload(store);
  const checkoutHref = "https://buy.stripe.com/REPLACE_WITH_YOUR_LINK";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Implementation</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Fix the clearest issue holding back your store
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Based on your ShopiFixer audit, we identified the strongest issue most likely suppressing
            conversion. This implementation is tied directly to that audit result so you know what is being fixed before you pay.
          </p>

          <p className="mt-6 text-sm font-medium text-cyan-300">Fix for: {payload.store_domain}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{payload.store_domain}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Top Issue</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{payload.top_issue}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended Action</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{payload.recommended_action}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">What you’re paying for</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            When you purchase this service, we implement the recommended fix path tied to your audit
            and validate that the change is grounded in the issue your store surfaced.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            This is a focused implementation pass — not a vague optimization package, open-ended redesign, or generic retainer.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Deliverables</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                <li>Implementation of the recommended fix</li>
                <li>Validation pass after implementation</li>
                <li>Updated notes on what changed</li>
                <li>One next recommended move after the fix is in place</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Expectations</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
                <div>
                  <p className="font-semibold text-white">Timeline</p>
                  <p>3–5 business days from confirmed access and payment</p>
                </div>
                <div>
                  <p className="font-semibold text-white">What we may need</p>
                  <p>Shopify collaborator access, theme access, or brief implementation coordination depending on the fix</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.55),rgba(15,23,42,0.95))] p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Diagnosis first. Then implementation.</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
            You are paying for a focused fix tied to the audit result. That means the work begins with a defined issue, a defined action, and a clear implementation path.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-white">Ready to move forward?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            If you want us to implement this fix for your store, continue below.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={checkoutHref}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Buy Now
            </a>
            <p className="mt-3 text-sm text-slate-300">Fixed in 3–5 days. No retainer. No back-and-forth.</p>

            <Link
              href={`/audit-result?store=${encodeURIComponent(payload.store_domain)}`}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to Full Review
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
