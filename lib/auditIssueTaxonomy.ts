export type GovernedIssueCategory =
  | "MOBILE_CTA_VISIBILITY"
  | "VISUAL_HIERARCHY_COMPETITION"
  | "CHECKOUT_PATH_CLARITY"
  | "EXCESS_COMPETING_ACTIONS"
  | "PRODUCT_PAGE_COGNITIVE_LOAD"
  | "MOBILE_SCAN_FRICTION"
  | "TRUST_FRICTION"
  | "NAVIGATION_CONFUSION"
  | "CART_UNCERTAINTY"
  | "PRICING_SHIPPING_UNCERTAINTY"
  | "PURCHASE_MOMENTUM_INTERRUPTION"
  | "RECOVERY_OPPORTUNITY"
  | "EMAIL_CAPTURE_AMBIGUITY"
  | "LOW_CONFIDENCE_AMBIGUITY";

export type GovernedConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_SIGNAL";

export type AuditIssueTaxonomyItem = {
  category: GovernedIssueCategory;
  approvedPhrasing: string;
  approvedDirectionalFraming: string;
  approvedScopedNextStep: string;
  approvedRecoveryFraming: string | null;
  allowedRecommendationMatchers: RegExp[];
  forbiddenRecommendationMatchers: RegExp[];
  requiresEvidenceMatchers?: RegExp[];
  confidenceRestrictions: {
    minimumForSpecificExplanation: Exclude<GovernedConfidenceLevel, "INSUFFICIENT_SIGNAL">;
    allowRecoveryFraming: boolean;
  };
  matchers: RegExp[];
};

export const AUDIT_ISSUE_TAXONOMY: Record<GovernedIssueCategory, AuditIssueTaxonomyItem> = {
  MOBILE_CTA_VISIBILITY: {
    category: "MOBILE_CTA_VISIBILITY",
    approvedPhrasing: "The primary mobile action may not be visible early enough.",
    approvedDirectionalFraming:
      "Mobile shoppers may need a clearer next step before attention moves elsewhere.",
    approvedScopedNextStep:
      "Review the mobile CTA area and scope one clarity improvement before broader page changes.",
    approvedRecoveryFraming:
      "After the mobile path is clearer, Abando may support shoppers who still leave with intent.",
    allowedRecommendationMatchers: [/mobile/i, /cta/i, /button/i, /primary action/i, /next step/i],
    forbiddenRecommendationMatchers: [/shipping/i, /cart recovery/i, /email capture/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/mobile/i, /cta/i, /button/i, /call.to.action/i, /next step/i],
  },
  VISUAL_HIERARCHY_COMPETITION: {
    category: "VISUAL_HIERARCHY_COMPETITION",
    approvedPhrasing: "Competing visual priorities may be weakening the buying path.",
    approvedDirectionalFraming:
      "The page may ask buyers to decide what matters before the next action is clear.",
    approvedScopedNextStep:
      "Reduce competing emphasis around the purchase path and review the result before launch.",
    approvedRecoveryFraming:
      "Recovery should remain downstream until the primary storefront path is easier to follow.",
    allowedRecommendationMatchers: [/hierarchy/i, /competing/i, /emphasis/i, /visual/i, /priority/i],
    forbiddenRecommendationMatchers: [/shipping/i, /cart recovery/i, /email capture/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/hierarchy/i, /competing/i, /priority/i, /visual/i, /dilution/i],
  },
  CHECKOUT_PATH_CLARITY: {
    category: "CHECKOUT_PATH_CLARITY",
    approvedPhrasing: "The late-stage buying path may need clearer reassurance.",
    approvedDirectionalFraming:
      "Buyers may be slowing down near cart or checkout where certainty matters most.",
    approvedScopedNextStep:
      "Review the cart or checkout-adjacent reassurance before changing broader content.",
    approvedRecoveryFraming:
      "Abando may be relevant after checkout clarity is reviewed because the signal is close to abandonment.",
    allowedRecommendationMatchers: [/checkout/i, /cart/i, /shipping/i, /payment/i, /reassurance/i],
    forbiddenRecommendationMatchers: [/email capture/i, /newsletter/i, /popup/i],
    requiresEvidenceMatchers: [/checkout/i, /cart/i, /shipping/i, /payment/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: true,
    },
    matchers: [/checkout/i, /cart/i, /shipping/i, /payment/i, /late.stage/i],
  },
  EXCESS_COMPETING_ACTIONS: {
    category: "EXCESS_COMPETING_ACTIONS",
    approvedPhrasing: "Too many competing actions may be reducing decision clarity.",
    approvedDirectionalFraming:
      "Buyers may understand the page but still hesitate because several actions compete at once.",
    approvedScopedNextStep:
      "Clarify the primary action and soften secondary choices around that moment.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/primary action/i, /secondary/i, /choice/i, /clarify/i],
    forbiddenRecommendationMatchers: [/shipping/i, /cart recovery/i, /email capture/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/actions/i, /choices/i, /links/i, /options/i, /secondary/i],
  },
  PRODUCT_PAGE_COGNITIVE_LOAD: {
    category: "PRODUCT_PAGE_COGNITIVE_LOAD",
    approvedPhrasing: "The product page may be asking buyers to process too much at once.",
    approvedDirectionalFraming:
      "Purchase intent may weaken when product details, reassurance, and action priority are not clearly ordered.",
    approvedScopedNextStep:
      "Review the product-page sequence and reduce one source of decision load first.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/product/i, /details/i, /sequence/i, /decision load/i, /offer/i],
    forbiddenRecommendationMatchers: [/shipping/i, /cart recovery/i, /email capture/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/product/i, /offer/i, /details/i, /content/i, /cognitive/i],
  },
  MOBILE_SCAN_FRICTION: {
    category: "MOBILE_SCAN_FRICTION",
    approvedPhrasing: "The mobile page may be harder to scan than it needs to be.",
    approvedDirectionalFraming:
      "Mobile buyers may lose momentum when section order and action priority require extra interpretation.",
    approvedScopedNextStep:
      "Review the mobile scan path and tighten the first point where attention drifts.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/mobile/i, /scan/i, /scroll/i, /readability/i, /attention/i],
    forbiddenRecommendationMatchers: [/shipping/i, /cart recovery/i, /email capture/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/mobile/i, /scan/i, /scroll/i, /readability/i, /friction/i],
  },
  TRUST_FRICTION: {
    category: "TRUST_FRICTION",
    approvedPhrasing: "The buying path may need clearer reassurance before the next step.",
    approvedDirectionalFraming:
      "Buyer certainty can weaken when support, policy, or trust cues are not easy to connect to the purchase decision.",
    approvedScopedNextStep:
      "Review the reassurance moments nearest the buying action before changing broader page content.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/trust/i, /reassurance/i, /policy/i, /reviews?/i, /support/i],
    forbiddenRecommendationMatchers: [/email capture/i, /cart recovery/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/trust/i, /reassurance/i, /review/i, /policy/i, /support/i, /guarantee/i],
  },
  NAVIGATION_CONFUSION: {
    category: "NAVIGATION_CONFUSION",
    approvedPhrasing: "Navigation or category choice may be slowing the purchase path.",
    approvedDirectionalFraming:
      "Shoppers may need a simpler route from interest to product selection before purchase intent fades.",
    approvedScopedNextStep:
      "Review the first navigation choice and reduce one avoidable decision before the product path.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/navigation/i, /category/i, /menu/i, /collection/i, /path/i],
    forbiddenRecommendationMatchers: [/shipping/i, /email capture/i, /cart recovery/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/navigation/i, /nav/i, /category/i, /menu/i, /collection/i, /browse/i],
  },
  CART_UNCERTAINTY: {
    category: "CART_UNCERTAINTY",
    approvedPhrasing: "The cart moment may need clearer continuity before checkout.",
    approvedDirectionalFraming:
      "Buyers may pause when the cart does not clearly reinforce the next step, cost expectations, or purchase confidence.",
    approvedScopedNextStep:
      "Review cart-adjacent reassurance and clarify the next checkout step before broader changes.",
    approvedRecoveryFraming:
      "Abando may be relevant as a separate recovery layer if shoppers still exit after the cart path is clarified.",
    allowedRecommendationMatchers: [/cart/i, /checkout/i, /shipping/i, /cost/i, /reassurance/i],
    forbiddenRecommendationMatchers: [/email capture/i, /newsletter/i],
    requiresEvidenceMatchers: [/cart/i, /checkout/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: true,
    },
    matchers: [/cart/i, /basket/i, /checkout/i, /abandon/i, /recovery/i],
  },
  PRICING_SHIPPING_UNCERTAINTY: {
    category: "PRICING_SHIPPING_UNCERTAINTY",
    approvedPhrasing: "Cost or shipping clarity may be creating late-stage hesitation.",
    approvedDirectionalFraming:
      "Purchase momentum can soften when buyers cannot quickly understand delivery, cost, or payment expectations.",
    approvedScopedNextStep:
      "Review shipping and cost reassurance near the buying action before changing unrelated page areas.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/shipping/i, /cost/i, /delivery/i, /returns?/i, /payment/i],
    forbiddenRecommendationMatchers: [/email capture/i, /newsletter/i, /popup/i],
    requiresEvidenceMatchers: [/shipping/i, /cost/i, /delivery/i, /payment/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/shipping/i, /cost/i, /delivery/i, /returns?/i, /payment/i],
  },
  PURCHASE_MOMENTUM_INTERRUPTION: {
    category: "PURCHASE_MOMENTUM_INTERRUPTION",
    approvedPhrasing: "The purchase path may be losing momentum between interest and action.",
    approvedDirectionalFraming:
      "The storefront may be creating enough small pauses that buyers need extra effort to continue.",
    approvedScopedNextStep:
      "Review the transition from product interest to the next buying action and remove one avoidable pause.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/momentum/i, /path/i, /clarity/i, /friction/i, /next step/i],
    forbiddenRecommendationMatchers: [/email capture/i, /cart recovery/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "MEDIUM",
      allowRecoveryFraming: false,
    },
    matchers: [/momentum/i, /friction/i, /hesitation/i, /purchase path/i, /slow/i],
  },
  RECOVERY_OPPORTUNITY: {
    category: "RECOVERY_OPPORTUNITY",
    approvedPhrasing: "There may be a recoverable exit point after purchase intent forms.",
    approvedDirectionalFraming:
      "Recovery is most relevant when shoppers show intent and then leave before completing the purchase.",
    approvedScopedNextStep:
      "Confirm the exit point before adding or adjusting recovery messages.",
    approvedRecoveryFraming:
      "Abando may be relevant as parallel recovery infrastructure after the exit point is verified.",
    allowedRecommendationMatchers: [/recovery/i, /abandon/i, /email/i, /sms/i, /checkout/i],
    forbiddenRecommendationMatchers: [/shipping preview/i],
    requiresEvidenceMatchers: [/recovery/i, /abandon/i, /exit/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "HIGH",
      allowRecoveryFraming: true,
    },
    matchers: [/recovery/i, /abandon/i, /exit.intent/i, /email capture/i, /sms/i],
  },
  EMAIL_CAPTURE_AMBIGUITY: {
    category: "EMAIL_CAPTURE_AMBIGUITY",
    approvedPhrasing: "Email capture may need review, but the signal should be treated carefully.",
    approvedDirectionalFraming:
      "Capture behavior can vary by device, region, timing, and scripts, so this should not be treated as a complete diagnosis without review.",
    approvedScopedNextStep:
      "Confirm how capture appears across the first visit path before recommending a storefront change.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [/email/i, /capture/i, /newsletter/i, /popup/i, /intent/i],
    forbiddenRecommendationMatchers: [/shipping/i, /cost/i, /cart recovery/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "LOW",
      allowRecoveryFraming: false,
    },
    matchers: [/email capture/i, /newsletter/i, /popup/i, /exit.intent/i, /capture detected/i],
  },
  LOW_CONFIDENCE_AMBIGUITY: {
    category: "LOW_CONFIDENCE_AMBIGUITY",
    approvedPhrasing: "The available signals are not specific enough for a narrow diagnosis.",
    approvedDirectionalFraming:
      "The storefront should be reviewed manually before naming a precise purchase-path fix.",
    approvedScopedNextStep:
      "Use this as a review prompt, not as a recommendation to change the storefront yet.",
    approvedRecoveryFraming: null,
    allowedRecommendationMatchers: [],
    forbiddenRecommendationMatchers: [/shipping/i, /cart recovery/i, /email capture/i, /guarantee/i],
    confidenceRestrictions: {
      minimumForSpecificExplanation: "LOW",
      allowRecoveryFraming: false,
    },
    matchers: [/unknown/i, /unclear/i, /insufficient/i, /generic/i],
  },
};

export const GENERIC_AUDIT_FRAMING = {
  issueExplanation:
    "The available signals suggest a point of buyer hesitation, but the evidence is not strong enough for a specific diagnosis.",
  directionalImpact:
    "Directional only: the current audit suggests purchase-path friction without proving a precise revenue outcome.",
  scopedNextStep:
    "Review the storefront path before committing to a visible change.",
};

export function findTaxonomyItem(input: string): AuditIssueTaxonomyItem | null {
  const normalized = input.trim();

  if (!normalized) return null;

  return (
    Object.values(AUDIT_ISSUE_TAXONOMY).find((item) =>
      item.matchers.some((matcher) => matcher.test(normalized)),
    ) || null
  );
}
