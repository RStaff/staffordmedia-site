export type ShopifixerProof = {
  store_domain: string;
  audit_score: number;
  estimated_revenue_leak: string;
  confidence: string;
  top_issue: string;
  recommended_action: string;
  evidence_summary: string;
  screenshot_url?: string;
  benchmark_summary?: string;
  updated_at?: string;
};

function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

const PROOF_REGISTRY: Record<string, ShopifixerProof> = {
  "elkeyecoffee.com": {
    store_domain: "elkeyecoffee.com",
    audit_score: 56,
    estimated_revenue_leak: "Up to $10,500 estimated monthly opportunity",
    confidence: "Moderate confidence",
    top_issue: "No email capture detected",
    recommended_action: "Add or strengthen email capture before purchase drop-off",
    evidence_summary: "Mobile score 56/100, FCP 6.2 s, LCP 15.1 s, TBT 170 ms",
    screenshot_url: "/shopifixer-proof/elkeyecoffee-com.png",
  },
  "luckettstore.com": {
    store_domain: "luckettstore.com",
    audit_score: 58,
    estimated_revenue_leak: "Up to $8,000 estimated monthly opportunity",
    confidence: "Moderate confidence",
    top_issue: "Weak returns reassurance",
    recommended_action: "Make returns and reassurance clearer before checkout",
    evidence_summary: "Mobile score 58/100, FCP 6.4 s, LCP 16.6 s, TBT 30 ms",
    screenshot_url: "/shopifixer-proof/luckettstore-com.png",
  },
  "dripaccessory.com": {
    store_domain: "dripaccessory.com",
    audit_score: 38,
    estimated_revenue_leak: "Up to $5,500 estimated monthly opportunity",
    confidence: "Moderate confidence",
    top_issue: "Weak returns reassurance",
    recommended_action: "Make returns and reassurance clearer before checkout",
    evidence_summary: "Mobile score 38/100, FCP 8.8 s, LCP 17.3 s, TBT 740 ms",
    screenshot_url: "/shopifixer-proof/dripaccessory-com.png",
  },
};

export function getShopifixerProof(store: string): ShopifixerProof | null {
  const key = cleanStoreDomain(store);
  return PROOF_REGISTRY[key] || null;
}

export function getShopifixerProofRegistry() {
  return PROOF_REGISTRY;
}
