import Image from "next/image";
import Link from "next/link";
import type { AuditPayload } from "@/lib/auditPayload";
import { assertValidPayload } from "@/lib/auditPayload";
import { getStorefrontScreenshot } from "../../../lib/storefrontScreenshot";
import { buildAuditConfidence } from "../../../lib/buildAuditConfidence";
import { buildAnnotatedScreenshotSignals } from "../../../lib/buildAnnotatedScreenshotSignals";
import { buildGovernedAuditSynthesis } from "../../../lib/buildGovernedAuditSynthesis";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import EvidenceImageFrame from "@/components/commerce/EvidenceImageFrame";

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
    ? (configured.includes("/api/") ? configured : `${configured.replace(/\/$/, "")}/api/fix-audit`)
    : "https://app.abando.ai/api/fix-audit";

  return `${base}?store=${encodeURIComponent(store)}`;
}

function getDebugPayloadUrl(store: string) {
  const configured = String(process.env.NEXT_PUBLIC_SHOPIFIXER_ENGINE_URL || "").trim();
  const base = configured
    ? configured.replace(/\/api\/fix-audit.*$/, "").replace(/\/$/, "")
    : "https://app.abando.ai";

  return `${base}/api/debug-last-payload?store=${encodeURIComponent(store)}`;
}

async function fetchAuditPayload(store: string): Promise<AuditPayload> {
  const response = await fetch(getFixAuditUrl(store), {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const status = response.status;
    let errorCode = "AUDIT_ENGINE_UNAVAILABLE";

    try {
      const json = await response.json();
      errorCode = json?.error || errorCode;
    } catch {}

    if (status === 404 || errorCode === "audit_payload_not_found" || errorCode === "payload_not_found") {
      throw new Error("AUDIT_PAYLOAD_NOT_FOUND");
    }

    throw new Error("AUDIT_ENGINE_UNAVAILABLE");
  }

  const json = await response.json();
  return assertValidPayload(json?.payload || json);
}

async function verifyPayloadParity(store: string, payload: AuditPayload) {
  try {
    const response = await fetch(getDebugPayloadUrl(store), {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return;
    }

    const json = await response.json();
    const debugPayload = assertValidPayload(json?.payload || json);

    if (JSON.stringify(debugPayload) !== JSON.stringify(payload)) {
      console.error("❌ PAYLOAD DRIFT DETECTED", {
        store,
        uiPayload: payload,
        emailPayload: debugPayload,
      });
    }
  } catch (error) {
    console.error("❌ PAYLOAD DRIFT DETECTED", {
      store,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}

function InsightCard({ label, value, subcopy }: { label: string; value: string; subcopy: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-4 text-xl font-semibold leading-tight text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{subcopy}</p>
    </div>
  );
}

function RecoveryBridgeSection() {
  return (
    <section className="px-1 py-2 md:px-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Optional Recovery Layer</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Abando helps recover shoppers who still leave.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
        Separate from ShopiFixer. Useful after the storefront path is clearer.
      </p>

      <div className="mt-6 grid gap-x-8 gap-y-5 border-y border-slate-800/70 py-5 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-white">Recovery email</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Follow up with shoppers who left with intent.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Recovery SMS</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            A permissioned return path when SMS setup is appropriate.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Recovered checkout</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            A clearer way back to the buying path.
          </p>
        </div>
      </div>
    </section>
  );
}

function buildWhyThisMatters(topIssue: string, recommendedAction: string) {
  const normalized = topIssue.toLowerCase();
  let explanation =
    "The clearest friction point is likely creating hesitation at the moment buyers need a simple next step.";

  if (normalized.includes("cart recovery")) {
    explanation =
      "Customers already decided to buy, but something introduces hesitation. Without a clear return path, those buyers can disappear instead of coming back.";
  } else if (normalized.includes("checkout")) {
    explanation = "Friction is interrupting purchase intent near the decision stage, where buyers should feel certain about what happens next.";
  }

  return {
    explanation,
    nextMove: `The recommended path starts with a scoped test of: ${recommendedAction}`,
  };
}

function cleanOptionalText(value?: string) {
  const cleaned = String(value || "").trim();
  return cleaned || null;
}

function getConfidenceLevel(payload: AuditPayload) {
  return payload.confidence_level || "MEDIUM";
}

function buildQualityRead(payload: AuditPayload, fallback: ReturnType<typeof buildWhyThisMatters>) {
  const confidence = getConfidenceLevel(payload);
  const issueExplanation = cleanOptionalText(payload.issue_explanation);
  const directionalImpact = cleanOptionalText(payload.directional_impact);
  const scopedNextStep = cleanOptionalText(payload.scoped_next_step);
  const downstreamRecovery = cleanOptionalText(payload.downstream_recovery_recommendation);

  if (confidence === "INSUFFICIENT_SIGNAL") {
    return {
      explanation: fallback.explanation,
      nextMove: fallback.nextMove,
      proofSummary:
        "Available review context only. The recommendation stays directional.",
      issueContext:
        "Available signals show whether the fix should stay narrow.",
      nextStep:
        "The fix path starts after the recommendation is clear enough to review.",
      impactSubcopy: "Directional estimate from the current audit.",
      recoveryRecommendation: null,
    };
  }

  if (confidence === "LOW") {
    return {
      explanation: issueExplanation || fallback.explanation,
      nextMove: scopedNextStep ? `Recommended review path: ${scopedNextStep}` : fallback.nextMove,
      proofSummary:
        "Limited review context. Confirm the issue before scoping work.",
      issueContext:
        "Available signals suggest the first review focus.",
      nextStep:
        "Keep the fix narrow and reviewed before launch.",
      impactSubcopy: directionalImpact || "Directional estimate from the current audit.",
      recoveryRecommendation: downstreamRecovery,
    };
  }

  if (confidence === "HIGH") {
    return {
      explanation: issueExplanation || fallback.explanation,
      nextMove: scopedNextStep ? `The recommended path starts with: ${scopedNextStep}` : fallback.nextMove,
      proofSummary:
        "Purchase-path context, issue detail, and the recommended first move.",
      issueContext:
        "Supporting signals show whether the fix should stay narrow.",
      nextStep:
        scopedNextStep || "The Fix Me path turns this diagnosis into a focused implementation step, reviewed before launch.",
      impactSubcopy: directionalImpact || "Directional 30-day opportunity estimate from the current audit.",
      recoveryRecommendation: downstreamRecovery,
    };
  }

  return {
    explanation: issueExplanation || fallback.explanation,
    nextMove: scopedNextStep ? `Recommended next step: ${scopedNextStep}` : fallback.nextMove,
    proofSummary:
      "Purchase-path context, issue detail, and the recommended first move.",
    issueContext:
      "Supporting signals show whether the fix should stay narrow.",
    nextStep:
      scopedNextStep || "The Fix Me path turns this diagnosis into a focused implementation step, reviewed before launch.",
      impactSubcopy: directionalImpact || "Directional 30-day opportunity estimate from the current audit.",
    recoveryRecommendation: downstreamRecovery,
  };
}

function getScoreBandClasses(tone: string) {
  if (tone === "critical") return "border-rose-500/25 bg-rose-950/30 text-rose-200";
  if (tone === "weak") return "border-amber-500/25 bg-amber-950/30 text-amber-200";
  if (tone === "fair") return "border-cyan-500/25 bg-cyan-950/30 text-cyan-200";
  return "border-emerald-500/25 bg-emerald-950/30 text-emerald-200";
}

type PurchasePathAnnotation = {
  id: string;
  label: string;
  anchor: "header" | "product" | "cart" | "checkout" | "general";
  note: string;
};

function getClarificationCopy(confidence: AuditPayload["confidence_level"], qualityRead: ReturnType<typeof buildQualityRead>) {
  if (confidence === "INSUFFICIENT_SIGNAL") {
    return {
      signalLimit: "Signal limited",
      currentState: "The available signal is not strong enough to mark a specific visual friction point.",
      direction: "The next step should stay in review until the storefront path has enough evidence for a visible change.",
      detail: "No overlay is shown because the audit should not imply more certainty than the evidence supports.",
    };
  }

  if (confidence === "LOW") {
    return {
      signalLimit: "Needs review",
      currentState: "The audit suggests purchase-path friction, but the visual read should stay general.",
      direction: "A narrow clarification review should come before any visible storefront change.",
      detail: "The goal is to understand where attention may drift, not to claim a finished improvement.",
    };
  }

  if (confidence === "HIGH") {
    return {
      signalLimit: "Evidence available",
      currentState: qualityRead.explanation,
      direction: qualityRead.nextStep,
      detail: "The first clarification path can be reviewed more concretely because multiple signals line up.",
    };
  }

  return {
    signalLimit: "Needs review",
    currentState: qualityRead.explanation,
    direction: qualityRead.nextStep,
    detail: "This is a review direction, not a launched change.",
  };
}

function getVisibleAnnotations(confidence: AuditPayload["confidence_level"], annotations: PurchasePathAnnotation[]) {
  if (confidence === "INSUFFICIENT_SIGNAL") return [];
  if (confidence === "LOW") return annotations.slice(0, 1);
  if (confidence === "HIGH") return annotations.slice(0, 3);
  return annotations.slice(0, 2);
}

function ScopedFixPathProgression({ recommendedAction }: { recommendedAction: string }) {
  const steps = [
    {
      label: "Diagnosis",
      value: "The clearest issue is identified.",
    },
    {
      label: "Fix path",
      value: recommendedAction,
    },
    {
      label: "Review",
      value: "You approve visible changes first.",
    },
    {
      label: "Approval",
      value: "Launch only after approval.",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-slate-800/75 bg-slate-950/35 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        Scoped Fix Path
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.label} className="relative border-l border-cyan-400/25 pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{step.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{step.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurchasePathReviewSection({
  screenshotUrl,
  storeDomain,
  annotations,
  confidence,
  qualityRead,
  recommendedAction,
}: {
  screenshotUrl: string | null;
  storeDomain: string;
  annotations: PurchasePathAnnotation[];
  confidence: AuditPayload["confidence_level"];
  qualityRead: ReturnType<typeof buildQualityRead>;
  recommendedAction: string;
}) {
  const copy = getClarificationCopy(confidence, qualityRead);
  const visibleAnnotations = getVisibleAnnotations(confidence, annotations);

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-5 shadow-lg shadow-black/5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Buying Path Review</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Where buyers hesitate, and what to clarify first.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            This shows where buyers may hesitate, what signal was found, and what first fix direction is recommended. No live store change has happened.
          </p>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/55">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Storefront evidence</p>
                <p className="mt-1 text-sm font-semibold text-white">{storeDomain}</p>
              </div>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-950/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                {copy.signalLimit}
              </span>
            </div>
            <EvidenceImageFrame
              imageUrl={screenshotUrl}
              ariaLabel={`Current storefront snapshot for ${storeDomain}`}
              className="relative aspect-[16/10] min-h-[320px] overflow-hidden bg-slate-950 bg-contain bg-top bg-no-repeat md:min-h-[420px]"
              fallbackTitle="Storefront screenshot is not available yet."
              fallbackCopy="The audit result is still available below. Evidence review will stay tied to this store."
            >
              <p className="absolute bottom-4 right-4 max-w-xs rounded-full border border-slate-800 bg-slate-950/85 px-3 py-1.5 text-[11px] font-medium text-slate-400">
                Storefront evidence review.
              </p>
              {visibleAnnotations.length > 0 ? (
                <div className="absolute left-4 top-4 max-w-[min(24rem,calc(100%-2rem))] rounded-2xl border border-cyan-400/25 bg-slate-950/90 p-4 shadow-xl shadow-black/30 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Signal area
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Storefront observations, not a redesign mockup.
                  </p>
                </div>
              ) : null}
            </EvidenceImageFrame>
          </div>

          {visibleAnnotations.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {visibleAnnotations.map((annotation) => (
                <div key={annotation.id} className="border-l border-cyan-400/30 pl-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {annotation.anchor}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{annotation.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{annotation.note}</p>
                </div>
              ))}
            </div>
          ) : null}

          <ScopedFixPathProgression recommendedAction={recommendedAction} />
        </div>

        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/45 p-5 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Clarified Direction
          </p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-white">Buyer hesitation</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{copy.currentState}</p>
            </div>
            <div className="border-y border-slate-800/80 py-5">
              <p className="text-sm font-semibold text-white">First fix direction</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{copy.direction}</p>
            </div>
            <details className="border-t border-slate-800/80 pt-5">
              <summary className="cursor-pointer text-sm font-semibold text-white">Approval note</summary>
              <p className="mt-2 text-sm leading-7 text-slate-300">{copy.detail}</p>
            </details>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-900/25 bg-cyan-950/10 p-4">
            <p className="text-sm font-semibold text-cyan-100">Optional later: Abando recovery</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function AuditResultPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");

  if (!store) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
        <SystemProgressRail currentStage="scope" stateLabel="Scope" className="px-0 pt-0" />
        <RuntimeContinuityStrip
          className="px-0"
          items={[
            { label: "Now", value: "Example review." },
            { label: "Next", value: "Run your store audit." },
            { label: "Safe", value: "Demo only." },
          ]}
        />
        <div className="mx-auto max-w-6xl space-y-5 md:space-y-7">
          <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Example Full Audit</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Example diagnostic: mobile shoppers may be asked to notice too much at once.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              This is a static example. Run your store to get a real review.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <MetaCard label="Review Type" value="Demonstration Audit" />
              <MetaCard label="Example Issue" value="Mobile CTA visibility" />
              <MetaCard label="Estimated Impact" value="Directional only" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InsightCard
              label="Storefront observation"
              value="The main next step is visually easy to miss on mobile."
              subcopy="In this example, the purchase path has enough content that the action competes with secondary details."
            />
            <InsightCard
              label="Why it matters"
              value="Mobile visitors need one obvious next step before hesitation builds."
              subcopy="If the main CTA is not prominent, motivated shoppers may keep scanning instead of moving forward."
            />
            <InsightCard
              label="Estimated business impact"
              value="$2k-$6k/mo opportunity range"
              subcopy="A directional example range only, not an outcome promise."
            />
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Issue explanation</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              The fix path would start with clarity, not a full redesign.
            </h2>
            <div className="mt-4 max-w-4xl space-y-4">
              <p className="text-base leading-8 text-slate-200">
                The example issue is mobile CTA visibility. A scoped fix would focus on making the primary next step
                easier to recognize while preserving the current buying path.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Scoped fix framing</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">Narrow first move</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Improve mobile CTA clarity before considering broader page changes.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">Reviewed before launch</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  A real visible change should be checked before anything goes live.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-white">Review before changes</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Viewing this diagnostic does not modify a storefront.
                </p>
              </div>
            </div>
          </section>

          <RecoveryBridgeSection />

          <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Start</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">Move from example to a real store audit.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Start with your store URL. If there is a focused fix, you review it before launch.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
              <Link
                href="/pricing"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Start My Fix
              </Link>
              <Link
                href="/shopifixer"
                className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Run Your Store Audit
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  let payload;
  try {
    payload = await fetchAuditPayload(store);
  } catch {
    return (
        <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
          <SystemProgressRail currentStage="scope" stateLabel="Review unavailable" className="px-0 pt-0" />
          <RuntimeContinuityStrip
            className="px-0"
          items={[
              { label: "Now", value: "Audit result unavailable." },
              { label: "Next", value: "Refresh the audit." },
              { label: "Safe", value: "Review comes first." },
            ]}
          />
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/75 p-5 shadow-lg shadow-black/10 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">ShopiFixer</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">Your storefront review is not available yet.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Refresh the audit, then open the full storefront audit when the storefront read is ready.
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
  await verifyPayloadParity(store, payload);

  const requestFixesHref =
    `mailto:support@staffordmedia.ai` +
    `?subject=${encodeURIComponent(`ShopiFixer review for ${payload.store_domain}`)}` +
    `&body=${encodeURIComponent(
      `Store: ${payload.store_domain}\nAudit score: ${payload.audit_score}\nTop issue: ${payload.top_issue}\nRecommended action: ${payload.recommended_action}\n\nI want the prioritized first fixes for this store.`
    )}`;
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
  const whyThisMatters = buildWhyThisMatters(governedPayload.top_issue, governedPayload.recommended_action);
  const qualityRead = buildQualityRead(governedPayload, whyThisMatters);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="scope" stateLabel="Scope" className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: "Issue identified." },
          { label: "Next", value: "Review the fix direction." },
          { label: "Safe", value: "You approve before launch." },
        ]}
      />
      <div className="mx-auto max-w-6xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Full Storefront Audit</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">We found where buyers may be hesitating.</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Screenshots, storefront observations, and the first fix direction are connected here.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] md:gap-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5 md:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Audit score</p>
              <p className="mt-3 text-5xl font-semibold tracking-tight text-white">{payload.audit_score}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Score band</p>
              <p
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getScoreBandClasses(
                  auditConfidence.score_band_tone,
                )}`}
              >
                {auditConfidence.score_band_label}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Current audit score.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Confidence</p>
              <p className="mt-2 text-lg font-semibold capitalize text-white">{auditConfidence.confidence_label}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{auditConfidence.confidence_reason}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4 md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{auditConfidence.revenue_window_label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{payload.estimated_revenue_loss}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{auditConfidence.operator_read}</p>
            </div>
          </div>
          <div className="mt-5 inline-flex w-fit max-w-full items-center gap-2.5 rounded-xl border border-white/12 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_24px_rgba(0,0,0,0.22)]">
            <Image
              src="/brand/shopify_partner-logo-white.png"
              alt="Official Shopify Partner"
              width={220}
              height={48}
              className="h-6 w-auto shrink-0"
            />
            <span className="whitespace-nowrap text-sm font-medium text-slate-200">Official Shopify Partner</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
            <MetaCard label="Store Domain" value={payload.store_domain} />
            <MetaCard label="Generated" value={payload.generated_at} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            label={auditConfidence.revenue_window_label}
            value={payload.estimated_revenue_loss}
            subcopy={qualityRead.impactSubcopy}
          />
          <InsightCard
            label="Top Issue"
            value={payload.top_issue}
            subcopy="The first issue worth reviewing for this store."
          />
          <InsightCard
            label="Recommended Action"
            value={payload.recommended_action}
            subcopy="The focused fix path to review next."
          />
        </section>

        <section className="px-1 py-2 md:px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Why this matters</p>
          <div className="mt-4 max-w-3xl space-y-4">
            <p className="text-base leading-8 text-slate-200">{qualityRead.explanation}</p>
            <p className="text-sm leading-7 text-slate-300">{qualityRead.nextMove}</p>
          </div>
        </section>

        <PurchasePathReviewSection
          screenshotUrl={screenshotUrl}
          storeDomain={payload.store_domain}
          annotations={screenshotSignals.annotations}
          confidence={governedPayload.confidence_level}
          qualityRead={qualityRead}
          recommendedAction={governedPayload.recommended_action}
        />

        <section className="px-1 py-2 md:px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Issue context</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">What the shopper is likely feeling.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            {qualityRead.issueContext}
          </p>
          <div className="mt-5 grid gap-x-8 gap-y-4 border-y border-slate-800/70 py-5 md:grid-cols-2">
            {payload.issues.map((issue) => (
              <div key={issue} className="text-sm leading-7 text-slate-300">
                {issue}
              </div>
            ))}
          </div>
        </section>

        <RecoveryBridgeSection />

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Start</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">Move from buyer hesitation to a scoped fix.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            The clearest next move from this review is to scope <span className="font-semibold text-white">{payload.recommended_action}</span> first.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link
              href={`/pricing?store=${encodeURIComponent(payload.store_domain)}`}
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Start My Fix
            </Link>
            <Link
              href={`/shopifixer?store=${encodeURIComponent(payload.store_domain)}`}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Run ShopiFixer Again
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
