import type { AuditPayload } from "../src/lib/auditPayload";

export type AnnotatedScreenshotSignals = {
  annotations: Array<{
    id: string;
    label: string;
    anchor: "header" | "product" | "cart" | "checkout" | "general";
    note: string;
  }>;
};

function getAnchor(issue: string): "header" | "product" | "cart" | "checkout" | "general" {
  if (/header|hero|nav/i.test(issue)) return "header";
  if (/product|offer|merch/i.test(issue)) return "product";
  if (/cart|recovery/i.test(issue)) return "cart";
  if (/checkout|shipping|payment/i.test(issue)) return "checkout";
  if (/email capture|newsletter|popup|exit.intent/i.test(issue)) return "general";
  return "general";
}

function buildNote(issue: string): string {
  if (/cart recovery/i.test(issue)) {
    return "This issue suggests shoppers can leave the cart path without a clear recovery mechanism carrying intent forward.";
  }

  if (/shipping/i.test(issue)) {
    return "This signal points to late-stage hesitation where shipping clarity may not be strong enough to keep momentum intact.";
  }

  if (/checkout/i.test(issue)) {
    return "This read suggests friction is showing up close to purchase, where reassurance and continuity matter most.";
  }

  if (/email capture|newsletter|popup|exit.intent/i.test(issue)) {
    return "This signal may depend on timing, device, region, or scripts, so it should be confirmed before a specific change is recommended.";
  }

  return "This annotation is derived from the surfaced audit issues and highlights where the clearest conversion signal is likely concentrated.";
}

export function buildAnnotatedScreenshotSignals(
  payload: AuditPayload,
  screenshotUrl: string,
): AnnotatedScreenshotSignals {
  if (!screenshotUrl) {
    return { annotations: [] };
  }

  return {
    annotations: payload.issues.slice(0, 3).map((issue, index) => ({
      id: `annotation-${index + 1}`,
      label: issue,
      anchor: getAnchor(issue),
      note: buildNote(issue),
    })),
  };
}
