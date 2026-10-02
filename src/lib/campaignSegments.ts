export type CampaignSegment = {
  id: string;
  name: string;
  representativeBusinessTypes: readonly string[];
  costlyWorkflow: string;
  automationOpportunities: readonly string[];
  valueMechanism: string;
  cta: {
    label: string;
    href: "/automate";
  };
  contentAngle?: string;
  validationPriority: "initial" | "preserved";
};

const sharedContentAngle =
  "One Local Business. One Costly Workflow. One Practical Automation.";

export const campaignSegments: readonly CampaignSegment[] = [
  {
    id: "home-and-field-services",
    name: "Home and field services",
    representativeBusinessTypes: [
      "Plumbers",
      "Electricians",
      "HVAC",
      "Roofing",
      "Landscaping",
      "Cleaning",
      "Pest control",
    ],
    costlyWorkflow:
      "Missed calls and estimate requests can turn into slow, inconsistent follow-up while crews are in the field.",
    automationOpportunities: [
      "Acknowledge new inquiries and route them for review",
      "Prepare estimate and appointment follow-up reminders",
      "Keep scheduling handoffs visible across the office and field",
    ],
    valueMechanism:
      "Reduce repetitive coordination and make timely follow-up easier without removing staff control.",
    cta: { label: "Discuss this workflow", href: "/automate" },
    contentAngle: sharedContentAngle,
    validationPriority: "initial",
  },
  {
    id: "financial-services",
    name: "Financial services",
    representativeBusinessTypes: [
      "Accounting",
      "Bookkeeping",
      "Insurance",
      "Mortgage",
      "Advisory",
    ],
    costlyWorkflow:
      "Client document collection and status follow-up often require repeated, careful manual coordination.",
    automationOpportunities: [
      "Prepare reviewable reminders for missing information",
      "Route intake and status changes to the appropriate owner",
      "Organize recurring reporting and follow-up queues",
    ],
    valueMechanism:
      "Support consistent service and reduce manual tracking while preserving required review, recordkeeping, privacy, and compliance controls.",
    cta: { label: "Discuss this workflow", href: "/automate" },
    contentAngle: sharedContentAngle,
    validationPriority: "initial",
  },
  {
    id: "agencies-and-consultants",
    name: "Agencies and consultants",
    representativeBusinessTypes: [
      "Local agencies",
      "Remote agencies",
      "Independent consultants",
      "Professional-service teams",
    ],
    costlyWorkflow:
      "New inquiries, proposals, approvals, and client follow-up can become fragmented across inboxes and documents.",
    automationOpportunities: [
      "Organize qualified inquiry and discovery follow-up",
      "Prepare proposal and approval reminders",
      "Keep delivery handoffs and client updates visible",
    ],
    valueMechanism:
      "Make repeatable client work easier to track so people can focus on judgment, relationships, and delivery.",
    cta: { label: "Discuss this workflow", href: "/automate" },
    contentAngle: sharedContentAngle,
    validationPriority: "initial",
  },
  {
    id: "automotive-and-mobile-services",
    name: "Automotive and mobile services",
    representativeBusinessTypes: [
      "Repair shops",
      "Detailers",
      "Dealership service teams",
      "Mobile technicians",
    ],
    costlyWorkflow:
      "Appointment, estimate, and service-status follow-up can require repeated calls and manual updates.",
    automationOpportunities: [
      "Prepare appointment and estimate reminders",
      "Route service-status updates for staff review",
      "Organize follow-up after completed work",
    ],
    valueMechanism:
      "Reduce repetitive status coordination while keeping service decisions with the team.",
    cta: { label: "Discuss this workflow", href: "/automate" },
    validationPriority: "preserved",
  },
  {
    id: "e-commerce",
    name: "E-commerce",
    representativeBusinessTypes: [
      "Independent online stores",
      "Retail brands",
      "Subscription merchants",
    ],
    costlyWorkflow:
      "Store, customer-service, and reporting tasks can require repetitive checks and handoffs across tools.",
    automationOpportunities: [
      "Organize support and order-exception follow-up",
      "Prepare recurring operating reports",
      "Route storefront issues to the right reviewer",
    ],
    valueMechanism:
      "Make routine store operations easier to review and act on without promising sales outcomes.",
    cta: { label: "Discuss this workflow", href: "/automate" },
    validationPriority: "preserved",
  },
  {
    id: "other-workflow-heavy-businesses",
    name: "Other workflow-heavy businesses",
    representativeBusinessTypes: [
      "Local operators",
      "Specialty service firms",
      "Small teams with repeatable administrative work",
    ],
    costlyWorkflow:
      "A recurring handoff or follow-up process may depend on memory, spreadsheets, or repeated data entry.",
    automationOpportunities: [
      "Map the current process and its decision points",
      "Identify a bounded repetitive step for improvement",
      "Keep exceptions visible for human review",
    ],
    valueMechanism:
      "Clarify whether one practical automation can reduce avoidable effort without forcing a larger system change.",
    cta: { label: "Discuss this workflow", href: "/automate" },
    validationPriority: "preserved",
  },
] as const;
