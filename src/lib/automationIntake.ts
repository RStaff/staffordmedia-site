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
  recommendation: string;
  currentState: string;
  improvedState: string;
  humanControl: string;
};

export type AutomationOpportunityPreview = {
  whatWeSee: string;
  opportunities: AutomationOpportunity[];
  currentWorkflow: string;
  improvedWorkflow: string;
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
    recommendation:
      "Create a reviewed queue that acknowledges new inquiries and assigns each callback for staff follow-through.",
    currentState: "New inquiries can arrive through separate channels and wait for manual triage.",
    improvedState:
      "Validated inquiries enter one visible callback queue with ownership and exception flags.",
    humanControl:
      "Staff decide priority, make the callback, and approve every customer-facing response.",
    matches: (brief) =>
      includesAny(brief.improvements, ["Lead response", "Missed-call follow-up"]),
  },
  {
    id: "estimate-follow-up",
    title: "Estimate status and reminder workflow",
    recommendation:
      "Track estimate status and prepare bounded reminders for staff review when follow-up is due.",
    currentState: "Estimate status and follow-up timing can depend on manual notes or memory.",
    improvedState:
      "A status queue identifies estimates due for a reviewed reminder or personal follow-up.",
    humanControl:
      "Staff set estimate terms, approve messages, and decide when follow-up should stop.",
    matches: (brief) => brief.improvements.includes("Estimate / quote follow-up"),
  },
  {
    id: "scheduling",
    title: "Appointment reminder and exception workflow",
    recommendation:
      "Prepare reminders around confirmed appointments and route changes or exceptions back to staff.",
    currentState: "Appointment reminders and schedule changes require repeated manual coordination.",
    improvedState:
      "Confirmed appointments receive bounded reminders while exceptions return to a staff queue.",
    humanControl:
      "Staff confirm availability, resolve conflicts, and approve schedule changes.",
    matches: (brief) =>
      includesAny(brief.improvements, ["Scheduling", "Appointment reminders"]),
  },
  {
    id: "system-handoff",
    title: "Reviewed system handoff",
    recommendation:
      "Prepare validated information for a reviewed handoff between the systems already in use.",
    currentState: "The same information may be copied or re-entered across separate systems.",
    improvedState:
      "A bounded handoff prepares consistent data and pauses for review before any system change.",
    humanControl:
      "Staff verify the record, resolve mismatches, and authorize the final system update.",
    matches: (brief) =>
      includesAny(brief.improvements, [
        "Repetitive data entry",
        "Moving information between systems",
      ]),
  },
  {
    id: "customer-follow-up",
    title: "Staff-reviewed follow-up queue",
    recommendation:
      "Organize due follow-ups in a queue that gives staff context before any message is sent.",
    currentState: "Customer follow-up can be distributed across inboxes, notes, and individual memory.",
    improvedState:
      "A visible queue groups due follow-ups with context and an accountable owner.",
    humanControl:
      "Staff choose the timing, message, channel, and final outcome for each follow-up.",
    matches: (brief) => brief.improvements.includes("Customer follow-up"),
  },
  {
    id: "ecommerce-exceptions",
    title: "E-commerce exception and customer-service queue",
    recommendation:
      "Identify bounded order or customer-service exceptions and route them to a reviewed resolution queue.",
    currentState: "Order and customer-service exceptions can be spread across storefront and inbox views.",
    improvedState:
      "Recognized exceptions enter a prioritized queue with context for customer-service review.",
    humanControl:
      "Store staff decide refunds, order changes, customer messages, and exception resolution.",
    matches: (brief) =>
      brief.businessType === "E-commerce" ||
      brief.improvements.includes("E-commerce workflow"),
  },
];

const fallbackOpportunity: AutomationOpportunity = {
  id: "workflow-review",
  title: "Reviewed workflow handoff",
  recommendation:
    "Map the first repeatable handoff, define its exceptions, and prepare one bounded step for staff review.",
  currentState: "The selected work needs a clearer boundary before an automation is chosen.",
  improvedState:
    "One repeatable handoff is documented with ownership, evidence, and an explicit review point.",
  humanControl:
    "Staff choose the workflow boundary, approve every decision rule, and authorize any action.",
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

  return {
    whatWeSee: `A practical starting point is the coordination around ${language.work}. The preview identifies a bounded first workflow to confirm; it does not assume how your internal systems operate.`,
    opportunities,
    currentWorkflow: brief.currentWorkflow || first.currentState,
    improvedWorkflow: brief.desiredWorkflow || first.improvedState,
    humanControls: [
      first.humanControl,
      `${language.owner} retain authority over exceptions and any customer-facing action.`,
      "No system change or external message occurs without the agreed review and authorization boundary.",
    ],
    valueMechanisms: [
      "More consistent acknowledgement and handoff",
      "Clearer ownership of queued work and exceptions",
      "Less repetitive status checking and re-entry",
      "Better evidence for staff review and follow-up",
    ],
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
