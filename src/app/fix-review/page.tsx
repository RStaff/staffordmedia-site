import Link from "next/link";
import type { AuditPayload } from "@/lib/auditPayload";
import { assertValidPayload } from "@/lib/auditPayload";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import { BrowserEvidenceFrame } from "@/components/commerce/VisualEvidence";
import { buildAuditConfidence } from "../../../lib/buildAuditConfidence";
import { buildAnnotatedScreenshotSignals } from "../../../lib/buildAnnotatedScreenshotSignals";
import { buildGovernedAuditSynthesis } from "../../../lib/buildGovernedAuditSynthesis";
import { getStorefrontScreenshot } from "../../../lib/storefrontScreenshot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fix Review - Stafford Media Consulting",
  description: "Merchant-private ShopiFixer implementation review surface.",
};

type PageProps = {
  searchParams?: Promise<{ store?: string; packet?: string }>;
};

type ReviewState = {
  storeDomain: string;
  topIssue: string;
  recommendedAction: string;
  issueContext: string;
  readiness: "REVIEW_PACKET_PENDING" | "READY_FOR_SCOPE_REVIEW";
  screenshotUrl: string | null;
  annotations: Array<{ id: string; anchor: string; label: string; note: string }>;
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

async function fetchAuditPayload(store: string): Promise<AuditPayload | null> {
  try {
    const response = await fetch(getFixAuditUrl(store), {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const json = await response.json();
    return assertValidPayload(json?.payload || json);
  } catch {
    return null;
  }
}

function buildFallbackReview(store: string): ReviewState {
  return {
    storeDomain: store || "Store confirmation required",
    topIssue: "Storefront review unavailable",
    recommendedAction: "Confirm the audit context before a proposed change is prepared.",
    issueContext:
      "This review is ready once the store audit is loaded.",
    readiness: "REVIEW_PACKET_PENDING",
    screenshotUrl: null,
    annotations: [],
  };
}

function buildReviewState(payload: AuditPayload): ReviewState {
  const screenshotUrl = getStorefrontScreenshot(payload.store_domain);
  const auditConfidence = buildAuditConfidence(payload, {
    structured_audit_signals: payload.issues,
    screenshot_url: screenshotUrl,
  });
  const screenshotSignals = buildAnnotatedScreenshotSignals(payload, screenshotUrl);
  const governedPayload = buildGovernedAuditSynthesis({
    payload,
    screenshotSignals: screenshotSignals.annotations,
    confidenceLevel:
      payload.confidence_level ||
      (auditConfidence.confidence_label.toUpperCase() as AuditPayload["confidence_level"]),
  });

  return {
    storeDomain: governedPayload.store_domain,
    topIssue: governedPayload.top_issue,
    recommendedAction: governedPayload.recommended_action,
    issueContext:
      governedPayload.issue_explanation ||
      "The proposed implementation direction should stay tied to the clearest issue surfaced by the audit.",
    readiness: "READY_FOR_SCOPE_REVIEW",
    screenshotUrl,
    annotations: screenshotSignals.annotations,
  };
}

function ReviewStatusPill({ readiness }: { readiness: ReviewState["readiness"] }) {
  const ready = readiness === "READY_FOR_SCOPE_REVIEW";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        ready
          ? "border-cyan-400/30 bg-cyan-950/20 text-cyan-100"
          : "border-amber-400/25 bg-amber-950/20 text-amber-100"
      }`}
    >
      {ready ? "Ready for scope review" : "Reviewing"}
    </span>
  );
}

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
      {copy ? <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{copy}</p> : null}
    </div>
  );
}

export default async function FixReviewPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const payload = store ? await fetchAuditPayload(store) : null;
  const review = payload ? buildReviewState(payload) : buildFallbackReview(store);
  const auditHref = store ? `/audit-result?store=${encodeURIComponent(store)}` : "/audit-result";
  const pricingHref = store ? `/pricing?store=${encodeURIComponent(store)}` : "/pricing";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="review" stateLabel="Review active" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Scoped direction open." },
          { label: "Next", value: "Approve scoped fix." },
          { label: "Safe", value: "No storefront change before approval." },
        ]}
      />
      <div className="mx-auto max-w-6xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Scoped Fix Review
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Your scoped fix is ready to review.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                A focused fix path, grounded in your storefront evidence.
              </p>
            </div>
            {review.readiness === "READY_FOR_SCOPE_REVIEW" ? null : <ReviewStatusPill readiness={review.readiness} />}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Store</p>
              <p className="mt-2 text-sm font-medium text-slate-100">{review.storeDomain}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {review.readiness === "READY_FOR_SCOPE_REVIEW" ? "Scope review open." : "Audit context required."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Launch status</p>
              <p className="mt-2 text-sm font-medium text-slate-100">Review before launch.</p>
            </div>
          </div>
        </section>

        <BrowserEvidenceFrame
          title="Where the buying path needs clarity."
          subtitle="The scoped fix stays tied to this storefront evidence."
          screenshotUrl={review.screenshotUrl}
          callouts={[
            {
              label: "What the customer encounters",
              note: review.topIssue,
              tone: "cyan",
            },
            {
              label: "Where hesitation may occur",
              note: review.issueContext,
              tone: "amber",
            },
            {
              label: "Approval stays simple",
              note: "You approve visible changes before launch.",
              tone: "slate",
            },
          ]}
        />

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-5 shadow-lg shadow-black/5 md:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
            <SectionHeader
              eyebrow="Reviewed issue"
              title={review.topIssue}
              copy={review.issueContext}
            />
            <div className="border-l border-cyan-400/25 pl-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Scoped direction</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">{review.recommendedAction}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                A narrow purchase-path change for approval. No storefront change or recovery action is included.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Approval first
                </span>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Scoped fix only
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Approve</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Ready to authorize the scoped fix?
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Approval authorizes implementation work. Until then, the storefront remains unchanged.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={pricingHref}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Approve Scoped Fix
            </Link>
            <Link
              href={auditHref}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
            Back to Review
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
