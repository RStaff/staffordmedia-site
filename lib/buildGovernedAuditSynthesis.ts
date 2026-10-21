import type { AuditPayload } from "../src/lib/auditPayload";
import {
  type GovernedConfidenceLevel,
  type GovernedIssueCategory,
  AUDIT_ISSUE_TAXONOMY,
  GENERIC_AUDIT_FRAMING,
  findTaxonomyItem,
} from "./auditIssueTaxonomy";

type ScreenshotSignal = {
  label?: string;
  anchor?: "header" | "product" | "cart" | "checkout" | "general";
  note?: string;
};

type BuildGovernedAuditSynthesisInput = {
  payload: AuditPayload;
  screenshotSignals?: ScreenshotSignal[];
  confidenceLevel?: GovernedConfidenceLevel;
};

type GovernedQualityFields = Pick<
  AuditPayload,
  | "issue_explanation"
  | "directional_impact"
  | "scoped_next_step"
  | "downstream_recovery_recommendation"
  | "confidence_level"
>;

const PROHIBITED_LANGUAGE = [
  /\bAI[-\s]?detected\b/i,
  /\bAI\b/i,
  /\bguarantee(?:d)?\b/i,
  /\bwill recover\b/i,
  /\bwill increase\b/i,
  /\binstant(?:ly)?\b/i,
  /\bautomatic(?:ally)? optimize/i,
  /\bautonomous\b/i,
  /\bmagic\b/i,
  /\bgrowth hack\b/i,
  /\bproven to\b/i,
  /\bexplosive growth\b/i,
];

function normalizeConfidence(value?: string): GovernedConfidenceLevel {
  if (value === "HIGH" || value === "MEDIUM" || value === "LOW" || value === "INSUFFICIENT_SIGNAL") {
    return value;
  }

  return "MEDIUM";
}

function stepDownConfidence(confidence: GovernedConfidenceLevel): GovernedConfidenceLevel {
  if (confidence === "HIGH") return "MEDIUM";
  if (confidence === "MEDIUM") return "LOW";
  return confidence;
}

function textMatchesAny(text: string, matchers: RegExp[] = []) {
  if (!text.trim() || matchers.length === 0) return false;

  return matchers.some((matcher) => matcher.test(text));
}

function getEvidenceText(payload: AuditPayload, screenshotSignals: ScreenshotSignal[] = []) {
  const signalText = screenshotSignals
    .map((signal) => `${signal.anchor || ""} ${signal.label || ""} ${signal.note || ""}`)
    .join(" ");

  return [
    payload.top_issue,
    ...payload.issues,
    signalText,
  ].join(" ");
}

function getPrimaryIssueText(payload: AuditPayload) {
  return [payload.top_issue, payload.issues[0] || ""].join(" ");
}

function scoreTaxonomyCategory(payload: AuditPayload, screenshotSignals: ScreenshotSignal[] = []) {
  const primaryIssueText = getPrimaryIssueText(payload);
  const secondaryIssueText = payload.issues.slice(1).join(" ");
  const recommendationText = payload.recommended_action || "";
  const allEvidenceText = getEvidenceText(payload, screenshotSignals);

  const candidates = Object.values(AUDIT_ISSUE_TAXONOMY).map((item) => {
    let score = 0;

    for (const matcher of item.matchers) {
      if (matcher.test(primaryIssueText)) score += 6;
      if (matcher.test(secondaryIssueText)) score += 2;
      if (matcher.test(recommendationText)) score += 1;
    }

    for (const signal of screenshotSignals) {
      const signalText = `${signal.anchor || ""} ${signal.label || ""} ${signal.note || ""}`;
      for (const matcher of item.matchers) {
        if (matcher.test(signalText)) score += 1;
      }

      if (signal.anchor === "cart" && item.category === "CART_UNCERTAINTY") score += 2;
      if (signal.anchor === "checkout" && item.category === "CHECKOUT_PATH_CLARITY") score += 2;
      if (signal.anchor === "product" && item.category === "PRODUCT_PAGE_COGNITIVE_LOAD") score += 1;
      if (signal.anchor === "header" && item.category === "VISUAL_HIERARCHY_COMPETITION") score += 1;
    }

    if (item.allowedRecommendationMatchers.length > 0 && textMatchesAny(recommendationText, item.allowedRecommendationMatchers)) {
      score += 2;
    }

    if (textMatchesAny(recommendationText, item.forbiddenRecommendationMatchers)) {
      score -= 4;
    }

    if (item.requiresEvidenceMatchers && !textMatchesAny(allEvidenceText, item.requiresEvidenceMatchers)) {
      score -= 3;
    }

    return { item, score };
  });

  const strongest = candidates.sort((a, b) => b.score - a.score)[0];

  if (strongest && strongest.score > 0) {
    return strongest.item;
  }

  return findTaxonomyItem(allEvidenceText);
}

function hasProhibitedLanguage(value: string) {
  return PROHIBITED_LANGUAGE.some((pattern) => pattern.test(value));
}

function cleanField(value: string | null | undefined) {
  const cleaned = String(value || "").trim();

  if (!cleaned) return null;
  if (hasProhibitedLanguage(cleaned)) return null;

  return cleaned;
}

function assertGovernedFields(fields: GovernedQualityFields) {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;

    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`INVALID_GOVERNED_AUDIT_SYNTHESIS:${key}`);
    }

    if (hasProhibitedLanguage(value)) {
      throw new Error(`PROHIBITED_GOVERNED_AUDIT_SYNTHESIS:${key}`);
    }
  }
}

function buildDirectionalImpact(category: GovernedIssueCategory, confidence: GovernedConfidenceLevel) {
  const item = AUDIT_ISSUE_TAXONOMY[category];

  if (confidence === "HIGH") {
    return `Directional only: ${item.approvedDirectionalFraming}`;
  }

  if (confidence === "MEDIUM") {
    return `Directional only: ${item.approvedDirectionalFraming}`;
  }

  return GENERIC_AUDIT_FRAMING.directionalImpact;
}

function hasRecommendationConflict(payload: AuditPayload, category: GovernedIssueCategory) {
  const item = AUDIT_ISSUE_TAXONOMY[category];
  const recommendationText = payload.recommended_action || "";

  if (!recommendationText.trim()) return false;

  const explicitlyForbidden = textMatchesAny(recommendationText, item.forbiddenRecommendationMatchers);
  const explicitlyAllowed =
    item.allowedRecommendationMatchers.length === 0 ||
    textMatchesAny(recommendationText, item.allowedRecommendationMatchers);

  return explicitlyForbidden || !explicitlyAllowed;
}

function hasEvidenceConflict(
  payload: AuditPayload,
  category: GovernedIssueCategory,
  screenshotSignals: ScreenshotSignal[] = [],
) {
  const item = AUDIT_ISSUE_TAXONOMY[category];

  if (!item.requiresEvidenceMatchers) return false;

  return !textMatchesAny(getEvidenceText(payload, screenshotSignals), item.requiresEvidenceMatchers);
}

function getEffectiveConfidence(
  payload: AuditPayload,
  category: GovernedIssueCategory,
  confidence: GovernedConfidenceLevel,
  screenshotSignals: ScreenshotSignal[] = [],
) {
  let effectiveConfidence = confidence;
  const topIssueText = getPrimaryIssueText(payload);
  const recommendationConflict = hasRecommendationConflict(payload, category);
  const evidenceConflict = hasEvidenceConflict(payload, category, screenshotSignals);
  const captureSignalWithoutMatchingAction =
    /email capture|exit.intent|newsletter|popup/i.test(topIssueText) &&
    !/email|capture|newsletter|popup|intent/i.test(payload.recommended_action || "");

  if (recommendationConflict || evidenceConflict || captureSignalWithoutMatchingAction) {
    effectiveConfidence = stepDownConfidence(effectiveConfidence);
  }

  if (captureSignalWithoutMatchingAction && effectiveConfidence === "MEDIUM") {
    effectiveConfidence = "LOW";
  }

  return {
    effectiveConfidence,
    recommendationConflict,
    evidenceConflict,
    captureSignalWithoutMatchingAction,
  };
}

export function buildGovernedAuditSynthesis(input: BuildGovernedAuditSynthesisInput): AuditPayload {
  const confidence = normalizeConfidence(input.confidenceLevel || input.payload.confidence_level);

  if (confidence === "INSUFFICIENT_SIGNAL") {
    const fields: GovernedQualityFields = {
      issue_explanation: GENERIC_AUDIT_FRAMING.issueExplanation,
      directional_impact: GENERIC_AUDIT_FRAMING.directionalImpact,
      scoped_next_step: GENERIC_AUDIT_FRAMING.scopedNextStep,
      confidence_level: confidence,
    };

    assertGovernedFields(fields);

    return {
      ...input.payload,
      ...fields,
      downstream_recovery_recommendation: undefined,
    };
  }

  const taxonomyItem = scoreTaxonomyCategory(input.payload, input.screenshotSignals);

  if (!taxonomyItem || confidence === "LOW") {
    const fields: GovernedQualityFields = {
      issue_explanation:
        confidence === "LOW" ? "The audit suggests purchase-path friction that should be reviewed before action." : GENERIC_AUDIT_FRAMING.issueExplanation,
      directional_impact: GENERIC_AUDIT_FRAMING.directionalImpact,
      scoped_next_step: GENERIC_AUDIT_FRAMING.scopedNextStep,
      confidence_level: confidence,
    };

    assertGovernedFields(fields);

    return {
      ...input.payload,
      ...fields,
      downstream_recovery_recommendation: undefined,
    };
  }

  const {
    effectiveConfidence,
    recommendationConflict,
    evidenceConflict,
    captureSignalWithoutMatchingAction,
  } = getEffectiveConfidence(input.payload, taxonomyItem.category, confidence, input.screenshotSignals);

  if (effectiveConfidence === "LOW") {
    const explanation =
      recommendationConflict || evidenceConflict || captureSignalWithoutMatchingAction
        ? "The surfaced issue and suggested action need operator review before a specific fix path is named."
        : "The audit suggests purchase-path friction that should be reviewed before action.";

    const fields: GovernedQualityFields = {
      issue_explanation: explanation,
      directional_impact: GENERIC_AUDIT_FRAMING.directionalImpact,
      scoped_next_step: GENERIC_AUDIT_FRAMING.scopedNextStep,
      confidence_level: effectiveConfidence,
    };

    assertGovernedFields(fields);

    return {
      ...input.payload,
      ...fields,
      downstream_recovery_recommendation: undefined,
    };
  }

  const recoveryAllowed =
    effectiveConfidence === "HIGH" &&
    taxonomyItem.confidenceRestrictions.allowRecoveryFraming &&
    !recommendationConflict &&
    !evidenceConflict;

  const fields: GovernedQualityFields = {
    issue_explanation: taxonomyItem.approvedPhrasing,
    directional_impact: buildDirectionalImpact(taxonomyItem.category, effectiveConfidence),
    scoped_next_step: taxonomyItem.approvedScopedNextStep,
    downstream_recovery_recommendation: recoveryAllowed
      ? taxonomyItem.approvedRecoveryFraming || undefined
      : undefined,
    confidence_level: effectiveConfidence,
  };

  const cleanedFields: GovernedQualityFields = {
    issue_explanation: cleanField(fields.issue_explanation) || GENERIC_AUDIT_FRAMING.issueExplanation,
    directional_impact: cleanField(fields.directional_impact) || GENERIC_AUDIT_FRAMING.directionalImpact,
    scoped_next_step: cleanField(fields.scoped_next_step) || GENERIC_AUDIT_FRAMING.scopedNextStep,
    downstream_recovery_recommendation:
      cleanField(fields.downstream_recovery_recommendation) || undefined,
    confidence_level: effectiveConfidence,
  };

  assertGovernedFields(cleanedFields);

  return {
    ...input.payload,
    ...cleanedFields,
  };
}
