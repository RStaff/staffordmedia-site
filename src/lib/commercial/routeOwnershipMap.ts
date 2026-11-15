export type CommercialRouteState =
  | "system_promise"
  | "signal_identified"
  | "scope_prepared"
  | "review_active"
  | "awaiting_approval"
  | "changed_state_evidence"
  | "operational_closure"
  | "recovery_active";

export type RouteCommercialOwnership = {
  state: CommercialRouteState;
  owns: string[];
  forbidden: string[];
  primaryCta: string;
  secondaryCta?: string;
};

export const ROUTE_COMMERCIAL_OWNERSHIP = {
  "/shopifixer": {
    state: "system_promise",
    owns: ["system promise", "store URL entry", "ShopiFixer positioning"],
    forbidden: ["implementation proof", "completion confirmation", "Abando activation"],
    primaryCta: "Run ShopiFixer",
  },
  "/shopifixer/result": {
    state: "signal_identified",
    owns: ["signal preview", "commercial pressure", "full review handoff"],
    forbidden: ["full issue diagnosis", "deployment proof", "completion confirmation"],
    primaryCta: "Check Email to Continue Review",
    secondaryCta: "See Pricing",
  },
  "/audit-result": {
    state: "scope_prepared",
    owns: ["issue diagnosis", "commercial implication", "storefront hesitation evidence", "first fix direction"],
    forbidden: ["deployment proof", "completion confirmation", "recovery activation"],
    primaryCta: "Start My Fix",
    secondaryCta: "Run ShopiFixer Again",
  },
  "/pricing": {
    state: "awaiting_approval",
    owns: ["commercial authorization", "price clarity", "approval-before-launch reassurance"],
    forbidden: ["issue re-diagnosis", "proof delivery", "completion confirmation"],
    primaryCta: "Start My Fix",
    secondaryCta: "Back to Full Review",
  },
  "/fix-review": {
    state: "review_active",
    owns: ["observed issue review", "scoped implementation direction", "merchant approval checkpoint"],
    forbidden: ["changed-state proof", "completion confirmation", "Abando recovery activation"],
    primaryCta: "Approve Scoped Fix",
    secondaryCta: "Back to Review",
  },
  "/fix-proof": {
    state: "changed_state_evidence",
    owns: ["before-after comparison", "changed-state evidence", "implementation proof", "merchant proof review"],
    forbidden: ["issue diagnosis", "commercial teaser", "operational closeout confirmation"],
    primaryCta: "Review Changed-State Evidence",
    secondaryCta: "Back to Status",
  },
  "/fix-complete": {
    state: "operational_closure",
    owns: ["completion confirmation", "operational status summary", "remaining notes", "optional recovery transition"],
    forbidden: ["issue diagnosis", "annotated storefront audit", "active evidence investigation", "before-after proof review"],
    primaryCta: "Review Recovery Fit",
    secondaryCta: "Back to Proof",
  },
  "/abando-review": {
    state: "recovery_active",
    owns: ["recovery layer evaluation", "Abando fit review", "separate recovery boundary"],
    forbidden: ["ShopiFixer implementation authority", "unapproved recovery activation", "completion proof"],
    primaryCta: "Review Recovery Fit",
    secondaryCta: "Back to Fix Complete",
  },
} as const satisfies Record<string, RouteCommercialOwnership>;
