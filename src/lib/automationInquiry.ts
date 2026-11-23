import type { AutomationBrief } from "./automationIntake";

export const automationInquirySchema = "staffordmedia.automation_inquiry.v1";

export function buildInquiryPayload(
  brief: AutomationBrief,
  contact: { submissionId: string; name?: string; email: string; phone?: string; companyName?: string; contactAcknowledgement: boolean },
) {
  return {
    schema: automationInquirySchema,
    submissionId: contact.submissionId,
    name: contact.name || "",
    email: contact.email,
    phone: contact.phone || "",
    companyName: contact.companyName || "",
    businessType: brief.businessType || "",
    improvements: brief.improvements,
    systems: brief.systems,
    currentWorkflow: brief.currentWorkflow,
    desiredWorkflow: brief.desiredWorkflow,
    contactAcknowledgement: contact.contactAcknowledgement,
  };
}
