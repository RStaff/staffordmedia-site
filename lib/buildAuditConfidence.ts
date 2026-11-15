import type { AuditPayload } from "../src/lib/auditPayload";

type SupportingSignals = {
  structured_audit_signals?: string[] | null;
  technology_signal_state?: string | null;
  screenshot_url?: string | null;
};

export type AuditConfidence = {
  confidence_label: "high" | "medium" | "low";
  confidence_reason: string;
  operator_read: string;
  score_band_label: string;
  score_band_tone: "critical" | "weak" | "fair" | "strong";
  revenue_window_label: "Estimated 30-day revenue opportunity";
};

function getScoreBand(score: number): Pick<AuditConfidence, "score_band_label" | "score_band_tone"> {
  if (score <= 39) {
    return { score_band_label: "Critical", score_band_tone: "critical" };
  }

  if (score <= 59) {
    return { score_band_label: "Weak", score_band_tone: "weak" };
  }

  if (score <= 79) {
    return { score_band_label: "Fair", score_band_tone: "fair" };
  }

  return { score_band_label: "Strong", score_band_tone: "strong" };
}

function hasSupportingSignal(signals?: SupportingSignals) {
  if (!signals) return false;

  return Boolean(
    (signals.structured_audit_signals && signals.structured_audit_signals.length > 0) ||
      (signals.technology_signal_state && signals.technology_signal_state.trim() !== ""),
  );
}

function getSignalDomain(value: string) {
  if (/email capture|newsletter|popup|exit.intent/i.test(value)) return "capture";
  if (/cart recovery|abandon|recovery/i.test(value)) return "recovery";
  if (/checkout|shipping|payment|cart|cost/i.test(value)) return "checkout";
  if (/mobile|scan|scroll|readability/i.test(value)) return "mobile";
  if (/product|offer|details|merch/i.test(value)) return "product";
  if (/visual|hierarchy|competing|priority/i.test(value)) return "hierarchy";
  if (/trust|review|policy|support/i.test(value)) return "trust";
  return "general";
}

function hasIssueActionMismatch(payload: AuditPayload) {
  const issueDomain = getSignalDomain(`${payload.top_issue} ${payload.issues[0] || ""}`);
  const actionDomain = getSignalDomain(payload.recommended_action || "");

  if (issueDomain === "general" || actionDomain === "general") return false;
  if (issueDomain === actionDomain) return false;
  if (issueDomain === "recovery" && actionDomain === "checkout") return false;

  return true;
}

function hasRepeatedBenchmarkPattern(payload: AuditPayload) {
  const issueText = [payload.top_issue, ...payload.issues].join(" ");

  return (
    /missing cart recovery path/i.test(issueText) &&
    /add shipping cost preview/i.test(payload.recommended_action || "")
  );
}

function buildOperatorRead(payload: AuditPayload) {
  const primaryIssue = payload.issues[0] || payload.top_issue;
  const secondaryIssue = payload.issues[1] || payload.recommended_action;

  if (/checkout|cart|recovery/i.test(`${primaryIssue} ${secondaryIssue}`)) {
    return `The strongest signal points to checkout friction tied to ${primaryIssue.toLowerCase()} and ${secondaryIssue.toLowerCase()}.`;
  }

  return `The clearest signal points to ${primaryIssue.toLowerCase()}, with ${secondaryIssue.toLowerCase()} shaping the first fix worth testing.`;
}

export function buildAuditConfidence(
  payload: AuditPayload,
  supportingSignals?: SupportingSignals,
): AuditConfidence {
  const issueCount = payload.issues.length;
  const supportPresent = hasSupportingSignal(supportingSignals);
  const { score_band_label, score_band_tone } = getScoreBand(payload.audit_score);
  const mismatchPresent = hasIssueActionMismatch(payload);
  const repeatedBenchmarkPattern = hasRepeatedBenchmarkPattern(payload);

  if (mismatchPresent) {
    return {
      confidence_label: "low",
      confidence_reason:
        "The surfaced issue and recommended action do not fully align, so this should stay directional until operator review.",
      operator_read: buildOperatorRead(payload),
      score_band_label,
      score_band_tone,
      revenue_window_label: "Estimated 30-day revenue opportunity",
    };
  }

  if (issueCount >= 2 && supportPresent && !repeatedBenchmarkPattern) {
    return {
      confidence_label: "high",
      confidence_reason: "Multiple surfaced issues line up with supporting review context for this store.",
      operator_read: buildOperatorRead(payload),
      score_band_label,
      score_band_tone,
      revenue_window_label: "Estimated 30-day revenue opportunity",
    };
  }

  if (issueCount >= 1) {
    return {
      confidence_label: "medium",
      confidence_reason: repeatedBenchmarkPattern
        ? "The audit payload is usable, but the issue pattern is common enough that it should stay directional."
        : "The core audit payload is solid, with limited supporting context beyond the top surfaced issues.",
      operator_read: buildOperatorRead(payload),
      score_band_label,
      score_band_tone,
      revenue_window_label: "Estimated 30-day revenue opportunity",
    };
  }

  return {
    confidence_label: "low",
    confidence_reason: "This read is based on partial audit signals, so it should be treated as directional rather than exhaustive.",
    operator_read: buildOperatorRead(payload),
    score_band_label,
    score_band_tone,
    revenue_window_label: "Estimated 30-day revenue opportunity",
  };
}
