import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import OperatorShell from "@/components/operator/OperatorShell";

export const dynamic = "force-dynamic";

type Tone = "neutral" | "good" | "warn" | "bad";

type RuntimeState = {
  runtime_id: string;
  merchant_id: string;
  store_domain: string;
  lifecycle_state: string;
  mutation_depth: string;
  replayable: boolean;
  rollback_ready: boolean;
  current_owner: string;
  risk_level: string;
  approvals?: {
    ross?: { status?: string };
    merchant?: { status?: string };
    deployment?: { status?: string };
  };
  active_execution_event?: {
    event_id?: string;
    result_status?: string;
    ledger_reference?: string;
    changed_files?: string[];
  };
  active_proof?: {
    proof_state?: string;
  };
};

type RuntimeEvent = {
  event_id: string;
  timestamp: string;
  runtime_id: string;
  merchant_id: string;
  event_type: string;
  previous_state: string;
  next_state: string;
  replayable: boolean;
  rollback_reference: string;
};

type Patch = {
  patch_id: string;
  title: string;
  status: string;
  target_surface: string;
};

type PatchQueue = {
  patches: Patch[];
};

type ControlLayer = {
  control_layer_id: string;
  name: string;
  scope: string;
  escalation_owner: string;
  allowed_actions?: string[];
  prohibited_actions?: string[];
};

type BoundaryRegistry = {
  control_layers: ControlLayer[];
};

const ROOT = process.cwd();
const RUNTIME_REGISTRY_DIR = path.join(ROOT, "staffordos", "runtime", "runtime_registry");
const EVENT_LEDGER_DIR = path.join(ROOT, "staffordos", "runtime", "event_ledger");
const DEV_CONTROL_DIR = path.join(ROOT, "staffordos", "dev_control");

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function readJsonDirectory<T>(dirPath: string): Promise<T[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dirPath, entry.name))
    .sort();

  return Promise.all(jsonFiles.map((filePath) => readJsonFile<T>(filePath)));
}

function statusTone(value: string | boolean | undefined): Tone {
  if (value === true) return "good";
  if (value === false) return "warn";
  if (!value) return "neutral";

  const normalized = String(value).toUpperCase();
  if (["DONE", "PASS", "APPROVED", "READY", "QA_PENDING", "LOW_LOCAL_DRY_RUN"].includes(normalized)) return "good";
  if (["PLANNED", "UNKNOWN", "NOT_REQUESTED", "NEEDS_REVIEW", "BLOCKED"].includes(normalized)) return "warn";
  if (["REJECTED", "FAILED", "DRIFT_RISK", "HIGH"].includes(normalized)) return "bad";
  return "neutral";
}

function Badge({ value, tone = "neutral" }: { value: string; tone?: Tone }) {
  const tones = {
    neutral: "border-slate-700 bg-slate-900 text-slate-300",
    good: "border-emerald-500/30 bg-emerald-950/40 text-emerald-200",
    warn: "border-amber-500/30 bg-amber-950/40 text-amber-200",
    bad: "border-rose-500/30 bg-rose-950/40 text-rose-200",
  };

  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${tones[tone]}`}>{value}</span>;
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

function countByStatus(patches: Patch[], status: string) {
  return patches.filter((patch) => patch.status === status).length;
}

export const metadata = {
  title: "StaffordOS Runtime Ops",
  description: "Read-only Runtime Operations Board over canonical StaffordOS truth artifacts.",
};

export default async function RuntimeOpsPage() {
  const [runtimeStates, runtimeEvents, patchQueue, boundaryRegistry] = await Promise.all([
    readJsonDirectory<RuntimeState>(RUNTIME_REGISTRY_DIR),
    readJsonDirectory<RuntimeEvent>(EVENT_LEDGER_DIR),
    readJsonFile<PatchQueue>(path.join(DEV_CONTROL_DIR, "patch_queue_v1.json")),
    readJsonFile<BoundaryRegistry>(path.join(DEV_CONTROL_DIR, "control_boundary_registry_v1.json")),
  ]);

  const sortedEvents = [...runtimeEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const rossPending = runtimeStates.filter((state) => state.approvals?.ross?.status === "UNKNOWN");
  const merchantPending = runtimeStates.filter((state) => state.approvals?.merchant?.status === "UNKNOWN");
  const qaPending = runtimeStates.filter((state) => state.lifecycle_state === "QA_PENDING");
  const doneCount = countByStatus(patchQueue.patches, "DONE");
  const plannedCount = countByStatus(patchQueue.patches, "PLANNED");
  const blockedCount = countByStatus(patchQueue.patches, "BLOCKED");

  return (
    <OperatorShell
      activeId="runtime-ops"
      title="Runtime Operations"
      description="Read-only observability over canonical runtime state, event ledger, lifecycle approvals, patch queue, and control boundaries."
    >
      <div className="space-y-5">
        <Section title="Runtime State Board">
          <div className="grid gap-3">
            {runtimeStates.map((state) => (
              <article key={state.runtime_id} className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-sm font-semibold text-white">{state.runtime_id}</h3>
                      <Badge value={state.lifecycle_state} tone={statusTone(state.lifecycle_state)} />
                      <Badge value={state.risk_level} tone={statusTone(state.risk_level)} />
                    </div>
                    <p className="mt-2 text-sm text-slate-400">
                      {state.merchant_id} · {state.store_domain}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3 lg:w-3/5">
                    <Field label="Mutation depth" value={state.mutation_depth} />
                    <Field label="Replayable" value={<Badge value={state.replayable ? "yes" : "no"} tone={statusTone(state.replayable)} />} />
                    <Field label="Rollback ready" value={<Badge value={state.rollback_ready ? "yes" : "no"} tone={statusTone(state.rollback_ready)} />} />
                    <Field label="Current owner" value={state.current_owner} />
                    <Field label="Execution event" value={state.active_execution_event?.event_id || "None"} />
                    <Field label="Proof state" value={state.active_proof?.proof_state || "UNKNOWN"} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Runtime Event Feed">
          <div className="grid gap-3">
            {sortedEvents.map((event) => (
              <article key={event.event_id} className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge value={event.event_type} />
                      <Badge value={event.replayable ? "replayable" : "not replayable"} tone={statusTone(event.replayable)} />
                    </div>
                    <p className="mt-2 break-words text-sm font-semibold text-white">{event.event_id}</p>
                    <p className="mt-1 text-sm text-slate-400">{event.timestamp}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3 lg:w-3/5">
                    <Field label="Transition" value={`${event.previous_state} -> ${event.next_state}`} />
                    <Field label="Runtime" value={event.runtime_id} />
                    <Field label="Rollback reference" value={event.rollback_reference || "None"} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Section title="Patch Queue Overview">
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-md border border-emerald-500/20 bg-emerald-950/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">DONE</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{doneCount}</p>
                </div>
                <div className="rounded-md border border-amber-500/20 bg-amber-950/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-amber-300">PLANNED</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{plannedCount}</p>
                </div>
                <div className="rounded-md border border-rose-500/20 bg-rose-950/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-rose-300">BLOCKED</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{blockedCount}</p>
                </div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Recent queue entries</p>
                <div className="mt-3 grid gap-2">
                  {patchQueue.patches.slice(-6).map((patch) => (
                    <div key={patch.patch_id} className="flex flex-col gap-1 border-t border-slate-800 pt-2 first:border-t-0 first:pt-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge value={patch.status} tone={statusTone(patch.status)} />
                        <span className="break-words text-sm font-semibold text-slate-200">{patch.patch_id}</span>
                      </div>
                      <p className="text-xs text-slate-500">{patch.target_surface}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Approval Visibility">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-amber-500/20 bg-amber-950/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Ross approvals pending</p>
                <p className="mt-2 text-2xl font-semibold text-white">{rossPending.length}</p>
              </div>
              <div className="rounded-md border border-amber-500/20 bg-amber-950/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Merchant approvals pending</p>
                <p className="mt-2 text-2xl font-semibold text-white">{merchantPending.length}</p>
              </div>
              <div className="rounded-md border border-cyan-500/20 bg-cyan-950/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">QA pending</p>
                <p className="mt-2 text-2xl font-semibold text-white">{qaPending.length}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {runtimeStates.map((state) => (
                <div key={`${state.runtime_id}-approval`} className="rounded-md border border-slate-800 bg-slate-900/45 p-3">
                  <p className="break-words text-sm font-semibold text-white">{state.runtime_id}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge value={`Ross: ${state.approvals?.ross?.status || "UNKNOWN"}`} tone={statusTone(state.approvals?.ross?.status)} />
                    <Badge value={`Merchant: ${state.approvals?.merchant?.status || "UNKNOWN"}`} tone={statusTone(state.approvals?.merchant?.status)} />
                    <Badge value={`Deployment: ${state.approvals?.deployment?.status || "UNKNOWN"}`} tone={statusTone(state.approvals?.deployment?.status)} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <Section title="Control Boundary Overview">
          <div className="grid gap-3 lg:grid-cols-3">
            {boundaryRegistry.control_layers.map((layer) => (
              <article key={layer.control_layer_id} className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{layer.name}</h3>
                  <Badge value={layer.control_layer_id} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{layer.scope}</p>
                <div className="mt-4 grid gap-3">
                  <Field label="Escalation owner" value={layer.escalation_owner} />
                  <Field label="Allowed actions" value={(layer.allowed_actions || []).join(", ")} />
                  <Field label="Prohibited actions" value={(layer.prohibited_actions || []).join(", ")} />
                </div>
              </article>
            ))}
          </div>
        </Section>
      </div>
    </OperatorShell>
  );
}
