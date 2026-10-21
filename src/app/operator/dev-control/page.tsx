import { readFile } from "node:fs/promises";
import path from "node:path";
import OperatorShell from "@/components/operator/OperatorShell";

export const dynamic = "force-dynamic";

type Surface = {
  surface_id: string;
  name: string;
  repo: string;
  machine_owner: string;
  route: string;
  route_owner_file: string;
  status: string;
  deployment_status: string;
  active_port: number | null;
  active_hostname: string | null;
  runtime_verified: boolean;
  runtime_owner_command: string | null;
  ross_visual_approval_status: string;
};

type Patch = {
  patch_id: string;
  title: string;
  target_surface: string;
  status: string;
  blocked_by?: string[];
  depends_on?: string[];
};

type SurfaceRegistry = {
  surfaces: Surface[];
};

type PatchQueue = {
  patches: Patch[];
};

type WorktreeRow = {
  status: string;
  file: string;
  classification: string;
  reason: string;
};

const CONTROL_DIR = path.join(process.cwd(), "staffordos", "dev_control");

const CONTROL_FILES = {
  surfaceRegistry: "surface_registry_v1.json",
  patchQueue: "patch_queue_v1.json",
  runtimeBinding: "runtime_surface_binding_v1.md",
  worktreeClassification: "worktree_classification_v1.md",
  approvalSession: "ross_visual_approval_session_v1.md",
};

const CLASSIFICATIONS = [
  "APPROVED_EXISTING_WORK",
  "DEPENDENCY_REPAIR_NOISE",
  "NEEDS_REVIEW",
  "DRIFT_RISK",
  "DO_NOT_TOUCH",
];

async function readControlFile(fileName: string) {
  return readFile(path.join(CONTROL_DIR, fileName), "utf8");
}

function parseMarkdownTable(markdown: string, headers: string[]) {
  const rows: string[][] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("|") || trimmed.includes("---")) {
      continue;
    }

    const cells = trimmed
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim().replace(/^`|`$/g, ""));

    if (headers.every((header, index) => cells[index] === header)) {
      continue;
    }

    if (cells.length >= headers.length) {
      rows.push(cells);
    }
  }

  return rows;
}

function parseWorktreeRows(markdown: string): WorktreeRow[] {
  return parseMarkdownTable(markdown, ["Status", "File", "Classification", "Reason"]).map(
    ([status, file, classification, reason]) => ({
      status,
      file,
      classification,
      reason,
    })
  );
}

function extractRuntimeValue(markdown: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`\\| ${escaped} \\| ([^|]+) \\|`));
  return match?.[1]?.trim().replace(/^`|`$/g, "") || "UNKNOWN";
}

function extractSection(markdown: string, heading: string) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`## ${escaped}\\n\\n([\\s\\S]*?)(\\n## |$)`));
  return match?.[1]?.trim() || "UNKNOWN";
}

function runtimeUrl(surface: Surface) {
  if (!surface.active_hostname || !surface.active_port) {
    return "Not runtime-bound";
  }

  return `http://${surface.active_hostname}:${surface.active_port}${surface.route}`;
}

function surfaceClassification(surface: Surface) {
  if (surface.status === "QUARANTINED" || surface.deployment_status === "quarantined") {
    return "QUARANTINED";
  }

  return surface.status;
}

function Badge({ value, tone = "neutral" }: { value: string; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const tones = {
    neutral: "border-slate-700 bg-slate-900 text-slate-300",
    good: "border-emerald-500/30 bg-emerald-950/40 text-emerald-200",
    warn: "border-amber-500/30 bg-amber-950/40 text-amber-200",
    bad: "border-rose-500/30 bg-rose-950/40 text-rose-200",
  };

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${tones[tone]}`}>
      {value}
    </span>
  );
}

function statusTone(value: string): "neutral" | "good" | "warn" | "bad" {
  if (value === "APPROVED" || value === "APPROVED_WITH_MODIFICATIONS" || value === "DONE") return "good";
  if (value === "UNKNOWN" || value === "NEEDS_REVIEW" || value === "PLANNED" || value === "BLOCKED") return "warn";
  if (value === "REJECTED" || value === "DRIFT_RISK" || value === "QUARANTINED") return "bad";
  return "neutral";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-1 break-words text-sm text-slate-200">{value}</div>
    </div>
  );
}

export const metadata = {
  title: "StaffordOS Dev Control",
  description: "Read-only operational visibility for StaffordOS dev_control truth artifacts.",
};

export default async function DevControlPage() {
  const [surfaceRegistryRaw, patchQueueRaw, runtimeBinding, worktreeClassification, approvalSession] =
    await Promise.all([
      readControlFile(CONTROL_FILES.surfaceRegistry),
      readControlFile(CONTROL_FILES.patchQueue),
      readControlFile(CONTROL_FILES.runtimeBinding),
      readControlFile(CONTROL_FILES.worktreeClassification),
      readControlFile(CONTROL_FILES.approvalSession),
    ]);

  const surfaceRegistry = JSON.parse(surfaceRegistryRaw) as SurfaceRegistry;
  const patchQueue = JSON.parse(patchQueueRaw) as PatchQueue;
  const worktreeRows = parseWorktreeRows(worktreeClassification);
  const worktreeGroups = CLASSIFICATIONS.map((classification) => ({
    classification,
    rows: worktreeRows.filter((row) => row.classification === classification),
  }));
  const nextSafeAction = extractSection(approvalSession, "Next Safe Action");
  const runtimeAuthorization = extractSection(runtimeBinding, "Abando CTA Authorization Answer");
  const blockedPatchLines = patchQueue.patches.map((patch) => {
    const blockers = patch.blocked_by && patch.blocked_by.length > 0 ? patch.blocked_by.join(" ") : "No blocked reason listed.";
    return `${patch.patch_id}: ${patch.status}. ${blockers}`;
  });
  const quarantinedSurfaces = surfaceRegistry.surfaces.filter(
    (surface) => surface.status === "QUARANTINED" || surface.deployment_status === "quarantined"
  );

  return (
    <OperatorShell
      activeId="dev-control"
      title="Dev Control"
      description="Read-only view of dev_control truth artifacts. This page does not execute patches or change repo state."
    >
      <div className="space-y-5">
        <Section title="Runtime Surfaces">
          <div className="grid gap-3">
            {surfaceRegistry.surfaces.map((surface) => (
              <article key={surface.surface_id} className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{surface.name}</h3>
                      <Badge value={surface.ross_visual_approval_status} tone={statusTone(surface.ross_visual_approval_status)} />
                      <Badge value={surface.runtime_verified ? "runtime verified" : "runtime unverified"} tone={surface.runtime_verified ? "good" : "warn"} />
                      <Badge value={surfaceClassification(surface)} tone={statusTone(surfaceClassification(surface))} />
                    </div>
                    <p className="mt-2 break-words text-sm text-slate-400">{runtimeUrl(surface)}</p>
                  </div>
                  <div className="grid gap-3 text-sm md:grid-cols-3 lg:w-3/5">
                    <Field label="Repo owner" value={surface.machine_owner} />
                    <Field label="Route owner" value={surface.route_owner_file} />
                    <Field label="Surface id" value={surface.surface_id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Patch Queue">
          <div className="grid gap-3">
            {patchQueue.patches.map((patch) => (
              <article key={patch.patch_id} className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-sm font-semibold text-white">{patch.patch_id}</h3>
                      <Badge value={patch.status} tone={statusTone(patch.status)} />
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{patch.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">Target: {patch.target_surface}</p>
                  </div>
                  <div className="grid gap-3 lg:w-3/5 lg:grid-cols-2">
                    <Field label="Dependencies" value={(patch.depends_on || ["None listed"]).join(", ")} />
                    <Field
                      label="Blocked reason"
                      value={(patch.blocked_by && patch.blocked_by.length > 0 ? patch.blocked_by : ["None listed"]).join(" ")}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Runtime Truth">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Active runtime port" value={extractRuntimeValue(runtimeBinding, "Active port")} />
            <Field label="Active hostname" value={extractRuntimeValue(runtimeBinding, "Hostname")} />
            <Field label="Runtime owner command" value={extractRuntimeValue(runtimeBinding, "Runtime owner command")} />
            <Field label="Canonical repo path" value={extractRuntimeValue(runtimeBinding, "Runtime cwd / repo path")} />
          </div>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Quarantined surfaces</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {quarantinedSurfaces.length > 0 ? (
                quarantinedSurfaces.map((surface) => (
                  <Badge key={surface.surface_id} value={`${surface.name}: ${surface.route}`} tone="bad" />
                ))
              ) : (
                <span className="text-sm text-slate-300">None listed</span>
              )}
            </div>
          </div>
        </Section>

        <Section title="Worktree Classification">
          <div className="grid gap-4">
            {worktreeGroups.map((group) => (
              <div key={group.classification} className="rounded-md border border-slate-800 bg-slate-900/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge value={group.classification} tone={statusTone(group.classification)} />
                  <span className="text-xs text-slate-500">{group.rows.length} files</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {group.rows.length > 0 ? (
                    group.rows.map((row) => (
                      <div key={`${row.status}-${row.file}`} className="rounded border border-slate-800 bg-slate-950/60 p-3">
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="font-semibold text-slate-300">{row.status}</span>
                          <span className="break-all text-slate-100">{row.file}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{row.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No files listed.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Next Safe Actions">
          <div className="grid gap-3">
            <div className="rounded-md border border-amber-500/20 bg-amber-950/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Approval session</p>
              <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-amber-100">{nextSafeAction}</pre>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Patch queue state</p>
              <div className="mt-2 grid gap-2">
                {blockedPatchLines.map((line) => (
                  <p key={line} className="text-sm leading-6 text-slate-300">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Runtime binding note</p>
              <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-300">{runtimeAuthorization}</pre>
            </div>
          </div>
        </Section>
      </div>
    </OperatorShell>
  );
}
