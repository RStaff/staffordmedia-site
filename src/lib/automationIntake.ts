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
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return null;
  }
  if (!brief.hasContent) {
    return `mailto:${email}`;
  }

  const subject = encodeURIComponent("Stafford Media automation brief");
  const body = encodeURIComponent(formatAutomationBrief(brief));
  return `mailto:${email}?subject=${subject}&body=${body}`;
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
