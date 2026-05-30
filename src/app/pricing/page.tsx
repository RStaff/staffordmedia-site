import Link from "next/link";
import type { AuditPayload } from "@/lib/auditPayload";
import { assertValidPayload } from "@/lib/auditPayload";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import { buildShopiFixerMerchantTrustProfile } from "@/lib/shopifixerMerchantTrust";

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
  const fallback = "https://buy.stripe.com/00w5kEe4sanJaHB15j00001";
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_FIX_CHECKOUT_URL || "").trim();

  if (!configured || /REPLACE_WITH_YOUR_LINK|placeholder/i.test(configured)) {
    return fallback;
  }

  return configured;
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
      <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
        <SystemProgressRail currentStage="approve" stateLabel="Authorization" className="px-0 pt-0" />
        <RuntimeContinuityStrip
          className="px-0"
          items={[
            { label: "Now", value: "Audit required." },
            { label: "Next", value: "Run ShopiFixer." },
            { label: "Safe", value: "No payment without review." },
          ]}
        />
        <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing & Checkout</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">Run a ShopiFixer audit first.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Pricing is tied to a real store review.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/shopifixer"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Run ShopiFixer
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.94))] p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">How Fix Me Works</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              Start with a real audit, then review the fix.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Payment is safest when it follows a clear diagnosis.
          </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">Scoped from the audit</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Focused on the highest-priority issue.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">Reviewed before launch</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Visible changes are checked before launch.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">Approval stays required</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  You approve visible changes first.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  let payload: AuditPayload;

  try {
    payload = await fetchAuditPayload(store);
  } catch {
    return (
        <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
          <SystemProgressRail currentStage="approve" stateLabel="Authorization unavailable" className="px-0 pt-0" />
          <RuntimeContinuityStrip
            className="px-0"
            items={[
              { label: "Now", value: "Storefront review unavailable." },
              { label: "Next", value: "Refresh the audit." },
              { label: "Safe", value: "Checkout follows review." },
            ]}
          />
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing & Checkout</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">Pricing opens after the storefront review is ready.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Refresh the audit, then return when the scoped review is available.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
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

  const trustProfile = buildShopiFixerMerchantTrustProfile(payload);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="approve" stateLabel="Awaiting authorization" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Scoped fix defined." },
          { label: "Next", value: "Authorize implementation." },
          { label: "Safe", value: "You approve before launch." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Focused Storefront Fix</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {trustProfile.pricingHeadline}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
        {trustProfile.pricingSubcopy}
      </p>

      <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-white/12 bg-slate-950 px-4 py-2 text-sm text-slate-200">
        <img src="/brand/smc-logo.inline.png" alt="Stafford Media Consulting" className="h-6 w-auto" />
        <span>Stafford Media implementation</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 md:gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{payload.store_domain}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Top issue</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{trustProfile.issueTitle}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Audit estimate</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{payload.estimated_revenue_loss}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/10 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">{trustProfile.proposedFixTitle}</p>
        <p className="mt-2 text-sm leading-6 text-slate-200">{trustProfile.proposedFixSummary}</p>
        <p className="mt-3 text-xs leading-5 text-slate-400">{trustProfile.confidenceDisclosure}</p>
      </div>
    </div>

    <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-6 shadow-xl shadow-black/20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Pricing & Checkout</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Ready to move forward?</h2>

      <div className="mt-5 text-5xl font-semibold tracking-tight text-white">
        $950 <span className="text-base font-medium text-slate-400">flat</span>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-300">
        Focused service. Flat fee. No retainer.
      </p>

      <div className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Included</p>
        <ul className="space-y-2 text-sm leading-6 text-slate-200">
          {trustProfile.deliverables.map((deliverable) => (
            <li key={deliverable}>{deliverable}</li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">
        After checkout, we confirm store details, access needs, and approval contact.
      </p>

      <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
        <a
          href={checkoutHref}
          className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Start My Fix
        </a>

        <a
          className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
          href={`/audit-result?store=${payload.store_domain}`}
        >
                Back to Audit Email
        </a>
      </div>
    </div>
  </div>
</section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Timeline</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Clear checkpoints before launch.</h2>
            <div className="mt-5 space-y-4">
              {trustProfile.timeline.map((item) => (
                <div key={item.question} className="border-l border-cyan-400/25 pl-4">
                  <p className="text-sm font-semibold text-white">{item.question}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Boundaries</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Focused work, no broad promises.</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              {trustProfile.exclusions.map((exclusion) => (
                <li key={exclusion}>{exclusion}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-400">{trustProfile.proofBoundary}</p>
          </div>
        </section>

        <details className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
  <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
    Safe launch details
  </summary>
  <div className="mt-4">
  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
    Expert work, reviewed before launch.
  </h2>

  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
    Your live store is not changed without approval.
  </p>

  <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
    <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
      <p className="text-sm font-semibold text-white">Visible review</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Visible changes are clear enough to review.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
      <p className="text-sm font-semibold text-white">Approval checkpoint</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        If the review is not right, work stays paused or gets revised.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
      <p className="text-sm font-semibold text-white">Original state protected</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        The original state stays protected before launch.
      </p>
    </div>
  </div>
  </div>
</details>
        <details className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
          <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Common questions
          </summary>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {trustProfile.objectionAnswers.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">{item.question}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </details>
      </div>
    </main>
  );
}
