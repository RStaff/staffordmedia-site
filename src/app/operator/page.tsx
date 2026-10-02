import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import OperatorShell from "@/components/operator/OperatorShell";

export const dynamic = "force-dynamic";

type PatchQueue = {
  patches: Array<{ patch_id: string; status: string }>;
};

type RuntimeState = {
  runtime_id: string;
  lifecycle_state: string;
  replayable: boolean;
  rollback_ready: boolean;
};

type ControlBoundaryRegistry = {
  control_layers: Array<{
    control_layer_id: string;
    name: string;
    scope: string;
  }>;
};

const ROOT = process.cwd();
const RUNTIME_REGISTRY_DIR = path.join(ROOT, "staffordos", "runtime", "runtime_registry");
const DEV_CONTROL_DIR = path.join(ROOT, "staffordos", "dev_control");

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function readRuntimeStates() {
  const entries = await readdir(RUNTIME_REGISTRY_DIR, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(RUNTIME_REGISTRY_DIR, entry.name))
    .sort();

  return Promise.all(jsonFiles.map((filePath) => readJsonFile<RuntimeState>(filePath)));
}

function StatusPill({ label }: { label: string }) {
  return <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-300">{label}</span>;
}

function OperatorCard({
  title,
  description,
  href,
  status = "AVAILABLE",
}: {
  title: string;
  description: string;
  href?: string;
  status?: "AVAILABLE" | "PLANNED" | "INCLUDED";
}) {
  const card = (
    <article className="h-full rounded-lg border border-slate-800 bg-slate-900/45 p-5 transition hover:border-slate-700">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <StatusPill label={status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );

  if (!href) return card;

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export const metadata = {
  title: "StaffordOS Operator",
  description: "Operator home for StaffordOS governance and runtime truth surfaces.",
};

export default async function OperatorHomePage() {
  const [runtimeStates, patchQueue, boundaryRegistry] = await Promise.all([
    readRuntimeStates(),
    readJsonFile<PatchQueue>(path.join(DEV_CONTROL_DIR, "patch_queue_v1.json")),
    readJsonFile<ControlBoundaryRegistry>(path.join(DEV_CONTROL_DIR, "control_boundary_registry_v1.json")),
  ]);

  const doneCount = patchQueue.patches.filter((patch) => patch.status === "DONE").length;
  const plannedCount = patchQueue.patches.filter((patch) => patch.status === "PLANNED").length;
  const blockedCount = patchQueue.patches.filter((patch) => patch.status === "BLOCKED").length;

  return (
    <OperatorShell
      activeId="home"
      title="StaffordOS Operator"
      description="One operating surface for governance, runtime truth, lifecycle state, mutation safety, approval visibility, and replayability."
    >
      <Section title="Operating Architecture">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md border border-cyan-500/20 bg-cyan-950/15 p-4">
            <p className="text-sm font-semibold text-white">StaffordMedia.ai</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Public business, trust, and conversion layer.</p>
            <div className="mt-3"><StatusPill label="PUBLIC" /></div>
          </div>
          <div className="rounded-md border border-cyan-500/20 bg-cyan-950/15 p-4">
            <p className="text-sm font-semibold text-white">ShopiFixer</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Audit, transformation, before/after proof, and approval flow.</p>
            <div className="mt-3"><StatusPill label="PUBLIC + FULFILLMENT" /></div>
          </div>
          <div className="rounded-md border border-violet-500/20 bg-violet-950/15 p-4">
            <p className="text-sm font-semibold text-white">Abando</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Revenue Recovery Agent and recovery proof lane.</p>
            <div className="mt-3"><StatusPill label="PRODUCT LANE" /></div>
          </div>
          <div className="rounded-md border border-amber-500/20 bg-amber-950/15 p-4">
            <p className="text-sm font-semibold text-white">StaffordOS</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Operator governance, runtime truth, lifecycle orchestration, and mutation governance.</p>
            <div className="mt-3"><StatusPill label="INTERNAL" /></div>
          </div>
        </div>
      </Section>

      <Section title="Operator Surfaces">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <OperatorCard title="Dev Control" description="Patch queue, visual approvals, runtime binding, and worktree classification." href="/operator/dev-control" />
          <OperatorCard title="Runtime Ops" description="Canonical runtime state, transition events, approvals, and control boundaries." href="/operator/runtime-ops" />
          <OperatorCard title="Merchant Lifecycle" description="Future read-only merchant state board over lifecycle manifests." status="PLANNED" />
          <OperatorCard title="Visual QA" description="Future before/after proof review surface. No visual automation is exposed here yet." status="PLANNED" />
          <OperatorCard title="ShopiFixer Fulfillment" description="Future surface for packets, sandboxes, replayability, rollback, and proof artifacts." status="PLANNED" />
          <OperatorCard title="Abando Recovery Control" description="Future surface for recovery proof readiness and Abando activation boundaries." status="PLANNED" />
        </div>
      </Section>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Section title="Current Operational Truth">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Runtime states</p>
              <p className="mt-2 text-2xl font-semibold text-white">{runtimeStates.length}</p>
            </div>
            <div className="rounded-md border border-emerald-500/20 bg-emerald-950/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">Done patches</p>
              <p className="mt-2 text-2xl font-semibold text-white">{doneCount}</p>
            </div>
            <div className="rounded-md border border-rose-500/20 bg-rose-950/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-rose-300">Blocked patches</p>
              <p className="mt-2 text-2xl font-semibold text-white">{blockedCount}</p>
            </div>
          </div>
          <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-950/15 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Planned patches</p>
            <p className="mt-2 text-2xl font-semibold text-white">{plannedCount}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Planned means recorded intent only. It does not authorize execution.</p>
          </div>
        </Section>

        <Section title="Control Boundaries">
          <div className="grid gap-3">
            {boundaryRegistry.control_layers.map((layer) => (
              <div key={layer.control_layer_id} className="rounded-md border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-white">{layer.name}</p>
                  <StatusPill label={layer.control_layer_id} />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{layer.scope}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </OperatorShell>
  );
}
