export const automationImprovements = [
  "Lead response",
  "Missed-call follow-up",
  "Customer follow-up",
  "Appointment reminders",
  "Estimate / quote follow-up",
  "Scheduling",
  "Repetitive data entry",
  "Reporting",
  "Moving information between systems",
  "E-commerce workflow",
  "Something else",
] as const;

export const automationBusinessTypes = [
  "Home Services",
  "Professional Services",
  "Automotive / Field Services",
  "E-commerce",
  "Other",
] as const;

export const automationSystems = [
  "CRM",
  "Email",
  "Phone",
  "Calendar",
  "Website",
  "Forms",
  "E-commerce platform",
  "Spreadsheets",
  "Accounting / business software",
  "Other",
] as const;

export const automationWorkflowTextMaxLength = 500;
export const automationMailtoUriMaxLength = 512;
export const automationIntakeStorageKey = "staffordmedia.automation-intake.v1";
export const automationBlueprintOfferAuthority = Object.freeze({
  offerId: "STAFFORDMEDIA_AUTOMATION_OPPORTUNITY_ASSESSMENT_V1",
  publicName: "Automation Opportunity Blueprint",
  priceUsd: 750,
  paymentType: "one_time",
  quantity: 1,
  paymentLinks: Object.freeze({
    preview: Object.freeze({
      approvedPath: "/test_fZu9AUf8w8fB8zt7tH00003",
      mode: "test",
    }),
    production: Object.freeze({
      approvedPath: "/cNieVe5xW8fBg1V8xL00002",
      mode: "live",
    }),
  }),
});
export const automationBlueprintOfferId = automationBlueprintOfferAuthority.offerId;
export const automationBlueprintPriceUsd = automationBlueprintOfferAuthority.priceUsd;

const automationBlueprintPaymentHostname = "buy.stripe.com";

const automationIntakeStorageSchema = "staffordmedia.automation_intake.v1";

export type AutomationIntakeSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type AutomationBrief = {
  improvements: string[];
  businessType: string | null;
  systems: string[];
  currentWorkflow: string;
  desiredWorkflow: string;
  hasContent: boolean;
};

export type AutomationOpportunity = {
  id: string;
  title: string;
  diagnosis: string;
  consequence: string;
  recommendation: string;
  currentSteps: string[];
  improvedSteps: string[];
  humanControl: string;
  valueMechanisms: string[];
};

export type AutomationOpportunityPreview = {
  primaryDiagnosis: string;
  primaryConsequence: string;
  opportunities: AutomationOpportunity[];
  currentWorkflowContext: string;
  desiredWorkflowContext: string;
  currentWorkflowSteps: string[];
  improvedWorkflowSteps: string[];
  humanControls: string[];
  valueMechanisms: string[];
  assessmentQuestions: string[];
};

const businessLanguage = {
  "Home Services": {
    work: "inquiries, callbacks, estimates, and field schedules",
    owner: "office or field staff",
  },
  "Professional Services": {
    work: "client requests, reviews, and professional-service handoffs",
    owner: "the responsible professional",
  },
  "Automotive / Field Services": {
    work: "service requests, dispatch decisions, and appointment exceptions",
    owner: "service or dispatch staff",
  },
  "E-commerce": {
    work: "customer questions, order exceptions, and storefront operations",
    owner: "store or customer-service staff",
  },
  Other: {
    work: "requests, handoffs, and follow-up work",
    owner: "the responsible team member",
  },
} as const;

type OpportunityDefinition = AutomationOpportunity & {
  matches: (brief: AutomationBrief) => boolean;
};

const includesAny = (values: string[], candidates: string[]) =>
  candidates.some((candidate) => values.includes(candidate));

const opportunityDefinitions: OpportunityDefinition[] = [
  {
    id: "lead-response",
    title: "Inquiry acknowledgement and callback queue",
    diagnosis:
      "The first workflow to improve is the handoff from a new inquiry to an owned callback.",
    consequence:
      "Without a visible acknowledgement and owner, an inquiry can wait or lose visibility between channels.",
    recommendation:
      "Create a reviewed queue that acknowledges new inquiries and assigns each callback for staff follow-through.",
    currentSteps: [
      "A customer inquiry arrives",
      "Someone notices and triages it manually",
      "Callback ownership or status may be unclear",
    ],
    improvedSteps: [
      "A customer inquiry arrives",
      "The system acknowledges and routes it",
      "Assigned staff review and complete the callback",
      "The outcome is recorded for follow-up",
    ],
    humanControl:
      "Staff decide priority, make the callback, and approve every customer-facing response.",
    valueMechanisms: [
      "Faster response",
      "Fewer forgotten follow-ups",
      "Better owner visibility",
      "Trackable outcomes",
    ],
    matches: (brief) =>
      includesAny(brief.improvements, ["Lead response", "Missed-call follow-up"]),
  },
  {
    id: "estimate-follow-up",
    title: "Estimate status and reminder workflow",
    diagnosis:
      "The first workflow to improve is knowing which estimates need a timely, appropriate follow-up.",
    consequence:
      "When status and next action are not visible together, follow-up can depend on repeated checking or memory.",
    recommendation:
      "Track estimate status and prepare bounded reminders for staff review when follow-up is due.",
    currentSteps: [
      "An estimate is issued",
      "Status is checked manually",
      "The next follow-up can lose visibility",
    ],
    improvedSteps: [
      "An estimate is issued",
      "Its status and due date are tracked",
      "Staff review the prepared follow-up",
      "The response or next action is recorded",
    ],
    humanControl:
      "Staff set estimate terms, approve messages, and decide when follow-up should stop.",
    valueMechanisms: [
      "Fewer forgotten follow-ups",
      "Reduced repetitive administration",
      "More consistent customer communication",
      "Trackable outcomes",
    ],
    matches: (brief) => brief.improvements.includes("Estimate / quote follow-up"),
  },
  {
    id: "scheduling",
    title: "Appointment reminder and exception workflow",
    diagnosis:
      "The first workflow to improve is the coordination between a confirmed appointment, reminders, and schedule exceptions.",
    consequence:
      "Repeated manual coordination can make changes harder to see and resolve consistently.",
    recommendation:
      "Prepare reminders around confirmed appointments and route changes or exceptions back to staff.",
    currentSteps: [
      "An appointment is confirmed",
      "Reminders and changes are handled manually",
      "Exceptions can be hard to track",
    ],
    improvedSteps: [
      "An appointment is confirmed",
      "The system prepares reminders and flags changes",
      "Assigned staff resolve exceptions",
      "The appointment outcome is tracked",
    ],
    humanControl:
      "Staff confirm availability, resolve conflicts, and approve schedule changes.",
    valueMechanisms: [
      "Reduced repetitive administration",
      "More consistent customer communication",
      "Clear exception handling",
      "Better owner visibility",
    ],
    matches: (brief) =>
      includesAny(brief.improvements, ["Scheduling", "Appointment reminders"]),
  },
  {
    id: "system-handoff",
    title: "Reviewed system handoff",
    diagnosis:
      "The first workflow to improve is moving the same information between the systems your team already uses.",
    consequence:
      "Repeated re-entry can consume staff attention and make mismatches harder to detect.",
    recommendation:
      "Prepare validated information for a reviewed handoff between the systems already in use.",
    currentSteps: [
      "A record changes in one system",
      "Staff copy or re-enter the information",
      "Completion or mismatch may lack visibility",
    ],
    improvedSteps: [
      "A validated record change is detected",
      "The system prepares the destination handoff",
      "Staff review mismatches and authorize the update",
      "The completed handoff is recorded",
    ],
    humanControl:
      "Staff verify the record, resolve mismatches, and authorize the final system update.",
    valueMechanisms: [
      "Reduced repetitive administration",
      "Better owner visibility",
      "Clear exception handling",
      "Trackable outcomes",
    ],
    matches: (brief) =>
      includesAny(brief.improvements, [
        "Repetitive data entry",
        "Moving information between systems",
      ]),
  },
  {
    id: "customer-follow-up",
    title: "Staff-reviewed follow-up queue",
    diagnosis:
      "The first workflow to improve is turning due customer follow-ups into visible, owned staff actions.",
    consequence:
      "When follow-up context is spread across notes and inboxes, the next action can be harder to see.",
    recommendation:
      "Organize due follow-ups in a queue that gives staff context before any message is sent.",
    currentSteps: [
      "A customer follow-up becomes due",
      "Staff search for context and decide what to do",
      "The next action may remain untracked",
    ],
    improvedSteps: [
      "A follow-up becomes due",
      "The system assembles context and routes it",
      "Assigned staff review and send the message",
      "The response and next action are tracked",
    ],
    humanControl:
      "Staff choose the timing, message, channel, and final outcome for each follow-up.",
    valueMechanisms: [
      "Fewer forgotten follow-ups",
      "Reduced repetitive administration",
      "More consistent customer communication",
      "Trackable outcomes",
    ],
    matches: (brief) => brief.improvements.includes("Customer follow-up"),
  },
  {
    id: "ecommerce-exceptions",
    title: "E-commerce exception and customer-service queue",
    diagnosis:
      "The first workflow to improve is bringing order and customer-service exceptions into one reviewed queue.",
    consequence:
      "Exceptions spread across storefront and inbox views can require repeated checking before staff can act.",
    recommendation:
      "Identify bounded order or customer-service exceptions and route them to a reviewed resolution queue.",
    currentSteps: [
      "An order or service exception occurs",
      "Staff search across storefront and inbox views",
      "Resolution status can be difficult to track",
    ],
    improvedSteps: [
      "A recognized exception occurs",
      "The system routes it with relevant context",
      "Store staff choose and approve the resolution",
      "The outcome is recorded",
    ],
    humanControl:
      "Store staff decide refunds, order changes, customer messages, and exception resolution.",
    valueMechanisms: [
      "Faster response",
      "Clear exception handling",
      "Better owner visibility",
      "Trackable outcomes",
    ],
    matches: (brief) =>
      brief.businessType === "E-commerce" ||
      brief.improvements.includes("E-commerce workflow"),
  },
];

const fallbackOpportunity: AutomationOpportunity = {
  id: "workflow-review",
  title: "Reviewed workflow handoff",
  diagnosis:
    "The first opportunity is to define one repeatable handoff clearly enough to automate it safely.",
  consequence:
    "Without a clear trigger, owner, and exception boundary, automation can move the wrong work or hide important decisions.",
  recommendation:
    "Map the first repeatable handoff, define its exceptions, and prepare one bounded step for staff review.",
  currentSteps: [
    "Work enters through an identified trigger",
    "The handoff is handled case by case",
    "Ownership or completion may lack visibility",
  ],
  improvedSteps: [
    "A validated trigger starts the workflow",
    "The system prepares a bounded handoff",
    "The responsible person reviews exceptions",
    "Completion is recorded",
  ],
  humanControl:
    "Staff choose the workflow boundary, approve every decision rule, and authorize any action.",
  valueMechanisms: [
    "Reduced repetitive administration",
    "Better owner visibility",
    "Clear exception handling",
    "Trackable outcomes",
  ],
};

export function buildAutomationOpportunityPreview(
  brief: AutomationBrief,
): AutomationOpportunityPreview | null {
  if (!brief.hasContent) return null;

  const language =
    businessLanguage[brief.businessType as keyof typeof businessLanguage] ||
    businessLanguage.Other;
  const matched = opportunityDefinitions
    .filter((definition) => definition.matches(brief))
    .slice(0, 3)
    .map(({ matches: _matches, ...opportunity }) => opportunity);
  const opportunities = matched.length ? matched : [fallbackOpportunity];
  const first = opportunities[0];
  const selectedWork = brief.improvements.length
    ? brief.improvements.slice(0, 2).join(" and ").toLowerCase()
    : "the workflow you described";
  const systems = brief.systems.length
    ? ` across ${brief.systems.slice(0, 3).join(", ")}`
    : "";
  const business = brief.businessType || "your business";

  return {
    primaryDiagnosis: `${first.diagnosis} For ${business.toLowerCase()}, your answers prioritize ${selectedWork}${systems}.`,
    primaryConsequence: `${first.consequence} This is a bounded diagnosis to confirm during the workflow interview, not an assumption about your internal operations.`,
    opportunities,
    currentWorkflowContext:
      brief.currentWorkflow || `Based on your selections: ${first.currentSteps.join(" → ")}.`,
    desiredWorkflowContext:
      brief.desiredWorkflow || `Recommended outcome: ${first.improvedSteps.join(" → ")}.`,
    currentWorkflowSteps: first.currentSteps,
    improvedWorkflowSteps: first.improvedSteps,
    humanControls: [
      first.humanControl,
      `${language.owner} retain authority over exceptions and any customer-facing action.`,
      "No system change or external message occurs without the agreed review and authorization boundary.",
    ],
    valueMechanisms: first.valueMechanisms.slice(0, 4),
    assessmentQuestions: [
      "Where does this work enter today, and which systems hold its source information?",
      "Who owns the next decision, and what evidence do they need?",
      "Which exceptions must always pause for human review?",
      "What confirms that the handoff or follow-up was completed correctly?",
    ],
  };
}

function valuesOf(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value : value === undefined ? [] : [value]).map(
    (item) => item.trim(),
  );
}

function recognizedValues(
  value: string | string[] | undefined,
  allowed: readonly string[],
) {
  const requested = new Set(valuesOf(value));
  return allowed.filter((item) => requested.has(item));
}

function boundedText(value: string | string[] | undefined) {
  const first = valuesOf(value)[0] || "";
  const cleaned = first.replace(
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,
    "",
  );
  return Array.from(cleaned)
    .filter((character) => {
      const codePoint = character.codePointAt(0) || 0;
      return codePoint < 0xd800 || codePoint > 0xdfff;
    })
    .slice(0, automationWorkflowTextMaxLength)
    .join("")
    .trim();
}

export function parseAutomationBrief(
  params: AutomationIntakeSearchParams,
): AutomationBrief {
  const improvements = recognizedValues(
    params.improvement,
    automationImprovements,
  );
  const businessType =
    recognizedValues(params.businessType, automationBusinessTypes)[0] || null;
  const systems = recognizedValues(params.system, automationSystems);
  const currentWorkflow = boundedText(params.currentWorkflow);
  const desiredWorkflow = boundedText(params.desiredWorkflow);

  return {
    improvements,
    businessType,
    systems,
    currentWorkflow,
    desiredWorkflow,
    hasContent: Boolean(
      improvements.length ||
        businessType ||
        systems.length ||
        currentWorkflow ||
        desiredWorkflow,
    ),
  };
}

export function formatAutomationBrief(brief: AutomationBrief) {
  const lines = ["Automation brief"];

  if (brief.improvements.length) {
    lines.push(`Improvements: ${brief.improvements.join(", ")}`);
  }
  if (brief.businessType) {
    lines.push(`Business type: ${brief.businessType}`);
  }
  if (brief.systems.length) {
    lines.push(`Systems: ${brief.systems.join(", ")}`);
  }
  if (brief.currentWorkflow) {
    lines.push(`Current workflow: ${brief.currentWorkflow}`);
  }
  if (brief.desiredWorkflow) {
    lines.push(`Desired workflow: ${brief.desiredWorkflow}`);
  }

  return lines.join("\n");
}

export function parseStripeHostedPaymentLinkUrl(value: unknown) {
  if (typeof value !== "string" || value !== value.trim() || !value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== automationBlueprintPaymentHostname ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname === "/"
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export type AutomationBlueprintPaymentEnvironment = "preview" | "production";

export function resolveAutomationBlueprintPaymentUrl(
  value: unknown,
  environment: AutomationBlueprintPaymentEnvironment,
) {
  const safeUrl = parseStripeHostedPaymentLinkUrl(value);
  if (!safeUrl) return null;

  const authority = automationBlueprintOfferAuthority.paymentLinks[environment];
  if (!authority) return null;

  return new URL(safeUrl).pathname === authority.approvedPath
    ? safeUrl
    : null;
}

export function prepareAutomationBlueprintPurchase(
  storage: AutomationIntakeStorage,
  brief: AutomationBrief,
  configuredPaymentUrl: unknown,
  environment: AutomationBlueprintPaymentEnvironment,
) {
  const paymentUrl = resolveAutomationBlueprintPaymentUrl(
    configuredPaymentUrl,
    environment,
  );
  if (!paymentUrl) return null;
  storeAutomationBrief(storage, brief);
  return paymentUrl;
}

export function buildAutomationMailto(
  contactEmail: string | undefined,
  brief: AutomationBrief,
) {
  const email = contactEmail?.trim() || "";
  const addressParts = email.split("@");
  const localPart = addressParts[0] || "";
  const domain = addressParts[1] || "";
  const domainLabels = domain.split(".");
  const validLocalPart =
    localPart.length > 0 &&
    localPart.length <= 64 &&
    !localPart.startsWith(".") &&
    !localPart.endsWith(".") &&
    !localPart.includes("..") &&
    /^[A-Za-z0-9.!$'*+\-=_^`{|}~]+$/.test(localPart);
  const validDomain =
    domain.length > 0 &&
    domain.length <= 253 &&
    domainLabels.length >= 2 &&
    domainLabels.every(
      (label) =>
        label.length > 0 &&
        label.length <= 63 &&
        !label.startsWith("-") &&
        !label.endsWith("-") &&
        /^[A-Za-z0-9-]+$/.test(label),
    );

  if (
    email.length > 254 ||
    addressParts.length !== 2 ||
    /[\u0000-\u001f\u007f\s<>?&#%,;]/.test(email) ||
    !validLocalPart ||
    !validDomain
  ) {
    return null;
  }
  const mailto = brief.hasContent
    ? `mailto:${email}?subject=${encodeURIComponent("Stafford Media automation brief")}&body=${encodeURIComponent("I have an automation brief ready to paste into this email.")}`
    : `mailto:${email}`;
  return mailto.length <= automationMailtoUriMaxLength ? mailto : null;
}

type AutomationIntakeStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

function canonicalStoredBrief(brief: AutomationBrief) {
  return {
    schema: automationIntakeStorageSchema,
    improvements: brief.improvements,
    businessType: brief.businessType,
    systems: brief.systems,
    currentWorkflow: brief.currentWorkflow,
    desiredWorkflow: brief.desiredWorkflow,
  };
}

export function storeAutomationBrief(
  storage: AutomationIntakeStorage,
  brief: AutomationBrief,
) {
  if (!brief.hasContent) {
    storage.removeItem(automationIntakeStorageKey);
    return;
  }
  storage.setItem(
    automationIntakeStorageKey,
    JSON.stringify(canonicalStoredBrief(brief)),
  );
}

export function readAutomationBrief(storage: AutomationIntakeStorage) {
  const raw = storage.getItem(automationIntakeStorageKey);
  if (!raw) return null;

  try {
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
      return null;
    }

    const record = stored as Record<string, unknown>;
    const expectedKeys = [
      "businessType",
      "currentWorkflow",
      "desiredWorkflow",
      "improvements",
      "schema",
      "systems",
    ];
    if (
      Object.keys(record).sort().join("|") !== expectedKeys.join("|") ||
      record.schema !== automationIntakeStorageSchema ||
      !Array.isArray(record.improvements) ||
      !record.improvements.every((value) => typeof value === "string") ||
      !(record.businessType === null || typeof record.businessType === "string") ||
      !Array.isArray(record.systems) ||
      !record.systems.every((value) => typeof value === "string") ||
      typeof record.currentWorkflow !== "string" ||
      typeof record.desiredWorkflow !== "string"
    ) {
      return null;
    }

    const brief = parseAutomationBrief({
      improvement: record.improvements as string[],
      businessType: (record.businessType as string | null) || undefined,
      system: record.systems as string[],
      currentWorkflow: record.currentWorkflow as string,
      desiredWorkflow: record.desiredWorkflow as string,
    });

    if (
      !brief.hasContent ||
      JSON.stringify(canonicalStoredBrief(brief)) !== JSON.stringify(record)
    ) {
      return null;
    }
    return brief;
  } catch {
    return null;
  }
}

export function clearAutomationBrief(storage: AutomationIntakeStorage) {
  storage.removeItem(automationIntakeStorageKey);
}
