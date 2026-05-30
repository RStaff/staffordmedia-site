import type { AuditPayload } from "@/lib/auditPayload";

export type TrustAnswer = {
  question: string;
  answer: string;
};

export type ShopiFixerMerchantTrustProfile = {
  issueTitle: string;
  resultHeadline: string;
  resultSubcopy: string;
  pricingHeadline: string;
  pricingSubcopy: string;
  proposedFixTitle: string;
  proposedFixSummary: string;
  confidenceLabel: string;
  confidenceDisclosure: string;
  deliverables: string[];
  exclusions: string[];
  objectionAnswers: TrustAnswer[];
  timeline: TrustAnswer[];
  proofBoundary: string;
};

const noKingsStore = "no-kings-athletics.myshopify.com";

function normalizeStore(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function isLowSpecificity(payload: AuditPayload) {
  const issue = `${payload.top_issue} ${payload.issue_explanation || ""} ${payload.recommended_action || ""}`;
  return (
    payload.confidence_level === "LOW" ||
    payload.confidence_level === "INSUFFICIENT_SIGNAL" ||
    /reviewed manually|manual review|not strong enough|not enough signal/i.test(issue)
  );
}

export function buildShopiFixerMerchantTrustProfile(payload: AuditPayload): ShopiFixerMerchantTrustProfile {
  const store = normalizeStore(payload.store_domain);
  const lowSpecificity = isLowSpecificity(payload);

  if (store === noKingsStore) {
    return {
      issueTitle: "Purchase reassurance near the buying decision needs review.",
      resultHeadline: "Your product page has a purchase-path trust issue worth a focused fix.",
      resultSubcopy:
        "The automated signal is medium confidence, so the fix stays narrow: confirm the product-page buying surface, add a bounded reassurance cue, and show proof before closeout.",
      pricingHeadline: "Start a focused purchase-path reassurance fix for No Kings Athletics.",
      pricingSubcopy:
        "This is a bounded expert pass for the product-page buying area. Scope is confirmed before implementation, visible proof is reviewed before closeout, and no revenue lift is guaranteed.",
      proposedFixTitle: "Proposed focused fix",
      proposedFixSummary:
        "Review the product-page buying area and prepare one reassurance improvement near the buy buttons so shoppers see checkout and order-review confidence at the decision point.",
      confidenceLabel: "Medium confidence signal, human scope confirmation required",
      confidenceDisclosure:
        "The audit found a real purchase-path review signal, but not enough automated evidence to claim a precise conversion defect. Scope must be confirmed before implementation.",
      deliverables: [
        "Human scope confirmation tied to the audit issue",
        "One focused purchase-path improvement",
        "Before and after proof when visible changes apply",
        "Changed surface summary",
        "Rollback or reversal note",
        "Review before launch",
      ],
      exclusions: [
        "No broad redesign",
        "No checkout modification",
        "No theme-wide rebuild",
        "No revenue or conversion guarantee",
      ],
      objectionAnswers: [
        {
          question: "Why $950?",
          answer: "It covers one expert-led, proof-backed storefront fix, not a generic report or retainer.",
        },
        {
          question: "What exactly is fixed?",
          answer: "One purchase-path reassurance issue near the buying decision, confirmed before implementation.",
        },
        {
          question: "Will my live store change?",
          answer: "No live launch happens without approval.",
        },
        {
          question: "What proof will I receive?",
          answer: "Before/after screenshots when visible changes apply, a changed surface summary, and rollback posture.",
        },
        {
          question: "Is revenue guaranteed?",
          answer: "No. The service improves a specific purchase-path issue and does not guarantee lift.",
        },
      ],
      timeline: [
        {
          question: "Scope confirmation",
          answer: "Within 1 business day after checkout and intake.",
        },
        {
          question: "First proof target",
          answer: "Within 5 business days after access and approval are complete for one focused fix.",
        },
        {
          question: "If blocked",
          answer: "You get the blocker, owner, and next step within 1 business day.",
        },
      ],
      proofBoundary:
        "Proof means visible evidence of the scoped change and review boundary. It does not mean guaranteed revenue lift.",
    };
  }

  return {
    issueTitle: lowSpecificity ? "Purchase path needs human scope confirmation." : payload.top_issue,
    resultHeadline: lowSpecificity
      ? "Your audit found a purchase-path signal that needs human scope confirmation."
      : "Your audit found a focused storefront issue worth reviewing.",
    resultSubcopy: lowSpecificity
      ? "The automated signal is directional, so implementation does not start until the exact scope is confirmed."
      : "The review shows where buyer momentum may weaken and what should be reviewed first.",
    pricingHeadline: "Start a focused storefront fix for your store.",
    pricingSubcopy:
      "A focused expert pass tied to the issue your audit surfaced. Scope is confirmed before implementation and visible proof is reviewed before closeout.",
    proposedFixTitle: lowSpecificity ? "Manual scope confirmation required" : "Proposed focused fix",
    proposedFixSummary: lowSpecificity
      ? "The audit signal needs human review before a safe implementation scope can be confirmed."
      : payload.scoped_next_step || payload.recommended_action,
    confidenceLabel: lowSpecificity ? "Human scope confirmation required" : "Audit-backed signal",
    confidenceDisclosure: lowSpecificity
      ? "This finding should not be treated as a precise defect until the store surface is reviewed."
      : "Scope remains bounded to the reviewed storefront issue.",
    deliverables: [
      "Human scope confirmation tied to the audit issue",
      "One focused storefront improvement",
      "Before and after proof when visible changes apply",
      "Changed surface summary",
      "Rollback or reversal note",
      "Review before launch",
    ],
    exclusions: ["No broad redesign", "No checkout modification", "No theme-wide rebuild", "No revenue or conversion guarantee"],
    objectionAnswers: [
      {
        question: "Why $950?",
        answer: "It covers one expert-led, proof-backed storefront fix, not a generic report or retainer.",
      },
      {
        question: "What exactly is fixed?",
        answer: "One focused issue from the audit, confirmed before implementation.",
      },
      {
        question: "Will my live store change?",
        answer: "No live launch happens without approval.",
      },
      {
        question: "What proof will I receive?",
        answer: "Before/after screenshots when visible changes apply, a changed surface summary, and rollback posture.",
      },
      {
        question: "Is revenue guaranteed?",
        answer: "No. The service improves a specific purchase-path issue and does not guarantee lift.",
      },
    ],
    timeline: [
      {
        question: "Scope confirmation",
        answer: "Within 1 business day after checkout and intake.",
      },
      {
        question: "First proof target",
        answer: "Within 5 business days after access and approval are complete for one focused fix.",
      },
      {
        question: "If blocked",
        answer: "You get the blocker, owner, and next step within 1 business day.",
      },
    ],
    proofBoundary:
      "Proof means visible evidence of the scoped change and review boundary. It does not mean guaranteed revenue lift.",
  };
}
