import LifecycleColumn, { type LifecycleCardData } from "./LifecycleColumn";

export type LifecycleColumnId =
  | "LEAD_CAPTURED"
  | "AUDIT_GENERATED"
  | "QUALIFIED"
  | "QA_PENDING"
  | "APPROVAL_PENDING"
  | "READY_FOR_MANUAL_EXECUTION"
  | "BLOCKED"
  | "COMPLETED";

type LifecycleColumnConfig = {
  id: LifecycleColumnId;
  title: string;
  description: string;
};

const COLUMNS: LifecycleColumnConfig[] = [
  {
    id: "LEAD_CAPTURED",
    title: "LEAD_CAPTURED",
    description: "Intake exists; fulfillment has not started.",
  },
  {
    id: "AUDIT_GENERATED",
    title: "AUDIT_GENERATED",
    description: "Audit evidence exists for review.",
  },
  {
    id: "QUALIFIED",
    title: "QUALIFIED",
    description: "Merchant has a clear next lane.",
  },
  {
    id: "QA_PENDING",
    title: "QA_PENDING",
    description: "Proof or review is pending.",
  },
  {
    id: "APPROVAL_PENDING",
    title: "APPROVAL_PENDING",
    description: "Ross, merchant, or task approval is required.",
  },
  {
    id: "READY_FOR_MANUAL_EXECUTION",
    title: "READY_FOR_MANUAL_EXECUTION",
    description: "Future manual operator action may be eligible.",
  },
  {
    id: "BLOCKED",
    title: "BLOCKED",
    description: "A gate, approval, or dependency blocks movement.",
  },
  {
    id: "COMPLETED",
    title: "COMPLETED",
    description: "Deployment, rollback, or monitoring state is complete.",
  },
];

export type LifecycleBoardCard = LifecycleCardData & {
  columnId: LifecycleColumnId;
};

export default function LifecycleKanbanBoard({ cards }: { cards: LifecycleBoardCard[] }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">Merchant Lifecycle Board</p>
          <h1 className="mt-2 text-xl font-semibold text-white">Canonical workflow visibility</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Read-only grouping over StaffordOS runtime state, runtime events, and execution task readiness. The board does not move merchants or run work.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-emerald-500/25 bg-emerald-950/30 px-2.5 py-1 text-xs font-semibold text-emerald-200">READ ONLY</span>
          <span className="rounded border border-amber-500/25 bg-amber-950/30 px-2.5 py-1 text-xs font-semibold text-amber-200">NO LIVE EXECUTION</span>
          <span className="rounded border border-cyan-500/25 bg-cyan-950/30 px-2.5 py-1 text-xs font-semibold text-cyan-200">NO AUTOMATION ACTIVE</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="grid w-max grid-cols-8 gap-3">
          {COLUMNS.map((column) => (
            <LifecycleColumn
              key={column.id}
              title={column.title}
              description={column.description}
              cards={cards.filter((card) => card.columnId === column.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

