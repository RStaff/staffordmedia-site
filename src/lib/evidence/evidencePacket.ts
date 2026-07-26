import type { CanonicalIssueId, ProductBoundary } from "@/lib/evidence/operationalTopology";

export type EvidencePacket = {
  packet_id: string;
  store: string;
  product_boundary: ProductBoundary;
  evidence_state: "captured" | "awaiting_review" | "approved" | "revision_requested" | "deferred";
  surfaces: EvidenceSurface[];
};

export type EvidenceSurface = {
  id: string;
  type: "homepage" | "product" | "cart" | "checkout" | "mobile" | "navigation";
  image_url: string;
  viewport: "desktop" | "mobile";
  observations: EvidenceObservation[];
  captured_at?: string;
};

export type EvidenceObservation = {
  id: string;
  issue_id: CanonicalIssueId;
  title: string;
  observation: string;
  severity: "attention" | "review" | "blocked";
  unresolved?: boolean;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

const localEvidenceImageByStore: Record<string, string> = {
  "elkeyecoffee.com": "/shopifixer-proof/elkeyecoffee-com.png",
  "luckettstore.com": "/shopifixer-proof/luckettstore-com.png",
};

function normalizeStore(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function evidenceImageForStore(store: string) {
  const normalized = normalizeStore(store);
  return localEvidenceImageByStore[normalized] || "";
}

export function buildPlaceholderEvidencePacket(input: {
  packetId?: string | null;
  store: string;
  productBoundary?: ProductBoundary;
  evidenceState?: EvidencePacket["evidence_state"];
}): EvidencePacket {
  const normalizedStore = normalizeStore(input.store);
  const store = normalizedStore || "Store confirmation required";
  const packetId = input.packetId || `evidence_${(normalizedStore || "store-confirmation").replace(/[^a-z0-9]+/g, "-")}`;
  const imageUrl = evidenceImageForStore(normalizedStore);
  const productBoundary = input.productBoundary || "shopifixer";
  const desktopObservations: EvidenceObservation[] =
    productBoundary === "abando"
      ? [
          {
            id: "recovery_exit_context",
            issue_id: "RECOVERY_EXIT_CONTEXT_01",
            title: "Post-exit context needs review",
            observation: "Recovery review should start from where a shopper may leave with purchase intent still unresolved.",
            severity: "review",
            unresolved: true,
            bounds: { x: 12, y: 20, width: 48, height: 26 },
          },
          {
            id: "recovery_timing",
            issue_id: "RECOVERY_TIMING_01",
            title: "Recovery timing is not confirmed",
            observation: "Timing should remain a separate Abando review item before any activation or proof claim exists.",
            severity: "blocked",
            unresolved: true,
            bounds: { x: 42, y: 52, width: 42, height: 24 },
          },
        ]
      : [
          {
            id: "cta_visibility",
            issue_id: "CTA_VISIBILITY_01",
            title: "Primary action competes for attention",
            observation: "The main purchase action should stay visually dominant when surrounding content, offers, or navigation compete near the buying path.",
            severity: "attention",
            unresolved: true,
            bounds: { x: 9, y: 13, width: 40, height: 22 },
          },
          {
            id: "trust_interruption",
            issue_id: "TRUST_INTERRUPT_01",
            title: "Reassurance may arrive too late",
            observation: "Delivery, policy, or trust details should be reviewed where the shopper is deciding whether to continue.",
            severity: "review",
            unresolved: true,
            bounds: { x: 54, y: 40, width: 34, height: 24 },
          },
        ];
  const mobileObservations: EvidenceObservation[] =
    productBoundary === "abando"
      ? [
          {
            id: "recovery_exit_context",
            issue_id: "RECOVERY_EXIT_CONTEXT_01",
            title: "Exit context stays separate",
            observation: "Mobile recovery review should look at post-exit context without inheriting ShopiFixer implementation state.",
            severity: "review",
            unresolved: true,
            bounds: { x: 16, y: 18, width: 60, height: 30 },
          },
          {
            id: "recovery_timing",
            issue_id: "RECOVERY_TIMING_01",
            title: "Return timing needs evidence",
            observation: "Return timing remains an Abando eligibility question until separate recovery evidence supports it.",
            severity: "blocked",
            unresolved: true,
            bounds: { x: 18, y: 56, width: 54, height: 24 },
          },
        ]
      : [
          {
            id: "mobile_stacking",
            issue_id: "MOBILE_STACKING_01",
            title: "Mobile hierarchy compresses the decision path",
            observation: "On a narrow viewport, the shopper may need to interpret too much before the next buying action is visually clear.",
            severity: "attention",
            unresolved: true,
            bounds: { x: 16, y: 16, width: 60, height: 30 },
          },
          {
            id: "competing_attention",
            issue_id: "COMPETING_ATTENTION_01",
            title: "Secondary content competes with forward motion",
            observation: "Supporting content should be checked against the main purchase path so review can decide what stays prominent.",
            severity: "review",
            unresolved: true,
            bounds: { x: 18, y: 54, width: 54, height: 24 },
          },
        ];

  return {
    packet_id: packetId,
    store,
    product_boundary: productBoundary,
    evidence_state: input.evidenceState || "awaiting_review",
    surfaces: [
      {
        id: `${packetId}_desktop_homepage`,
        type: "homepage",
        image_url: imageUrl,
        viewport: "desktop",
        captured_at: "current-storefront-reference",
        observations: desktopObservations,
      },
      {
        id: `${packetId}_mobile_purchase_path`,
        type: "mobile",
        image_url: imageUrl,
        viewport: "mobile",
        captured_at: "current-storefront-reference",
        observations: mobileObservations,
      },
    ],
  };
}

export function primaryEvidenceSurface(packet: EvidencePacket, viewport: EvidenceSurface["viewport"] = "desktop") {
  return packet.surfaces.find((surface) => surface.viewport === viewport) || packet.surfaces[0] || null;
}
