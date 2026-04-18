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

function getCheckoutUrl() {
  return String(process.env.NEXT_PUBLIC_SHOPIFIXER_FIX_CHECKOUT_URL || "").trim() ||
    "https://buy.stripe.com/REPLACE_WITH_YOUR_LINK";
}

async function fetchAuditPayload(store: string): Promise<AuditPayload> {
  const response = await fetch(getFixAuditUrl(store), {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (response.status === 404) {
    throw new Error("AUDIT_PAYLOAD_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  return assertValidPayload(json?.payload || json);
}

export default async function PricingPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const checkoutHref = getCheckoutUrl();

  if (!store) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing & Checkout</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Run a ShopiFixer audit first.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Pricing and checkout are tied to the store diagnosis, so the commercial step stays grounded in the exact issue surfaced for that store.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/shopifixer"
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Run ShopiFixer
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let payload: AuditPayload;

  try {
    payload = await fetchAuditPayload(store);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message === "AUDIT_PAYLOAD_NOT_FOUND") {
      return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing & Checkout</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">No live audit is available for this store yet.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The pricing step is tied to the live ShopiFixer payload. Run the audit first, then return here for pricing and checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/shopifixer"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Run ShopiFixer
              </Link>
              <Link
                href={`/shopifixer/result?store=${encodeURIComponent(store)}`}
                className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Go to Summary
              </Link>
            </div>
          </div>
        </main>
      );
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-8 shadow-2xl shadow-black/30">
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">ShopiFixer Fix Sprint</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white">
        We fix your highest-impact conversion issue.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
        Based on your audit, we implement the clearest issue suppressing revenue in your store. This is a focused, done-for-you fix — not a redesign, not a retainer.
      </p>

      <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/12 bg-slate-950 px-4 py-2 text-sm text-slate-200">
        <img src="/brand/smc-logo.inline.png" alt="Stafford Media Consulting" className="h-6 w-auto" />
        <span>Stafford Media implementation</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{payload.store_domain}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Top issue</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{payload.top_issue}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Estimated 30-day opportunity</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{payload.estimated_revenue_loss}</p>
        </div>
      </div>
    </div>

    <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing & Checkout</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Ready to move forward?</h2>

      <div className="mt-5 text-5xl font-semibold tracking-tight text-white">
        $950 <span className="text-base font-medium text-slate-400">flat</span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-300">
        Paid service. Fixed in 3–5 days. No retainer. No back-and-forth.
      </p>

      <div className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">What’s included</p>
        <ul className="space-y-2 text-sm leading-6 text-slate-200">
          <li>Implementation of the recommended fix path</li>
          <li>Validation pass after implementation</li>
          <li>Updated notes on what changed</li>
          <li>One next recommended move after the fix is in place</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href="https://buy.stripe.com/REPLACE_WITH_YOUR_LINK"
          className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Buy Now
        </a>

        <a
          className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
          href={`/audit-result?store=${payload.store_domain}`}
        >
          Back to Full Review
        </a>
      </div>
    </div>
  </div>
</section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
    What’s included
  </p>

  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
    This is a focused Stafford Media implementation pass tied directly to the live audit result.
  </p>

  <div className="mt-6 grid gap-4 md:grid-cols-2">
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
      <ul className="space-y-3 text-sm leading-6 text-slate-200">
        <li>Implementation of the recommended fix path</li>
        <li>Validation pass after implementation</li>
        <li>Updated notes on what changed</li>
        <li>One next recommended move after the fix is in place</li>
      </ul>
    </div>

    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
      <div className="space-y-4 text-sm leading-6 text-slate-200">
        <div>
          <p className="font-semibold text-white">Timeline</p>
          <p>3–5 business days from confirmed access and payment</p>
        </div>

        <div>
          <p className="font-semibold text-white">What we may need</p>
          <p>Shopify collaborator access, theme access, or brief implementation coordination depending on the fix.</p>
        </div>
      </div>
    </div>
  </div>
</section>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.55),rgba(15,23,42,0.95))] p-8 shadow-2xl shadow-black/20">
  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
    Pricing & Checkout
  </p>

  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
    Ready to move forward?
  </h2>

  <div className="mt-6 text-4xl font-semibold text-white">
    $950 <span className="text-base font-medium text-slate-400">flat</span>
  </div>

  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
    Paid service. Fixed in 3–5 days. No retainer. No back-and-forth.
  </p>

  <div className="mt-6 flex flex-wrap gap-4">
    <a
      href="https://buy.stripe.com/REPLACE_WITH_YOUR_LINK"
      className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
    >
      Buy Now
    </a>

    <a
      className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
      href={`/audit-result?store=${payload.store_domain}`}
    >
      Back to Full Review
    </a>
  </div>
</section>
      </div>
    </main>
  );
}
