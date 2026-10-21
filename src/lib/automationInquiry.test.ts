import { describe, expect, it } from "vitest";
import { buildInquiryPayload } from "./automationInquiry";
import type { AutomationBrief } from "./automationIntake";

const brief: AutomationBrief = {
  improvements: ["Lead response"],
  businessType: null,
  systems: [],
  currentWorkflow: "A request arrives.",
  desiredWorkflow: "A person reviews it.",
  hasContent: true,
};

describe("automation inquiry consent", () => {
  it("carries the actual checked acknowledgement", () => {
    const contact = { submissionId: "web_test", email: "owner@example.com" };
    expect(buildInquiryPayload(brief, { ...contact, contactAcknowledgement: false }).contactAcknowledgement).toBe(false);
    expect(buildInquiryPayload(brief, { ...contact, contactAcknowledgement: true }).contactAcknowledgement).toBe(true);
  });
});
