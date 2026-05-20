import Link from "next/link";

type OperatorNavItem = {
  id: string;
  label: string;
  description: string;
  href?: string;
  status: "AVAILABLE" | "PLANNED" | "INCLUDED";
};

const NAV_ITEMS: OperatorNavItem[] = [
  {
    id: "home",
    label: "Operator Home",
    description: "StaffordOS orientation and surface map.",
    href: "/operator",
    status: "AVAILABLE",
  },
  {
    id: "dev-control",
    label: "Dev Control",
    description: "Patch gates, runtime binding, visual approvals.",
    href: "/operator/dev-control",
    status: "AVAILABLE",
  },
  {
    id: "runtime-ops",
    label: "Runtime Ops",
    description: "Runtime state, event ledger, approvals.",
    href: "/operator/runtime-ops",
    status: "AVAILABLE",
  },
  {
    id: "merchant-lifecycle",
    label: "Merchant Lifecycle",
    description: "Read-only merchant workflow board.",
    href: "/operator/lifecycle-board",
    status: "AVAILABLE",
  },
  {
    id: "patch-queue",
    label: "Patch Queue",
    description: "Visible inside Dev Control.",
    href: "/operator/dev-control",
    status: "INCLUDED",
  },
  {
    id: "visual-qa",
    label: "Visual QA",
    description: "Before/after proof review surface.",
    status: "PLANNED",
  },
  {
    id: "execution-review",
    label: "Execution Review",
    description: "Pre-execution fulfillment cockpit.",
    href: "/operator/execution-review",
    status: "AVAILABLE",
  },
  {
    id: "shopifixer-fulfillment",
    label: "ShopiFixer Fulfillment",
    description: "Mutation packets, sandboxes, proof, rollback.",
    status: "PLANNED",
  },
  {
    id: "abando-recovery",
    label: "Abando Recovery Control",
    description: "Recovery proof and activation readiness.",
    status: "PLANNED",
  },
  {
    id: "runtime-registry",
    label: "Runtime Registry",
    description: "Visible inside Runtime Ops.",
    href: "/operator/runtime-ops",
    status: "INCLUDED",
  },
  {
    id: "event-ledger",
    label: "Event Ledger",
    description: "Visible inside Runtime Ops.",
    href: "/operator/runtime-ops",
    status: "INCLUDED",
  },
];

function statusClasses(status: OperatorNavItem["status"]) {
  if (status === "AVAILABLE") return "border-emerald-500/25 bg-emerald-950/30 text-emerald-200";
  if (status === "INCLUDED") return "border-cyan-500/25 bg-cyan-950/30 text-cyan-200";
  return "border-slate-700 bg-slate-900 text-slate-400";
}

function NavStatus({ status }: { status: OperatorNavItem["status"] }) {
  return <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${statusClasses(status)}`}>{status}</span>;
}

export default function OperatorSidebar({ activeId }: { activeId: string }) {
  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-950/75 p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">StaffordOS Operator</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">Internal governance, runtime truth, and approval visibility.</p>
      </div>

      <nav className="mt-5 grid gap-2" aria-label="StaffordOS operator navigation">
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeId;
          const baseClass = `block rounded-md border p-3 transition ${
            active
              ? "border-amber-400/35 bg-amber-950/20"
              : "border-slate-800 bg-slate-900/35 hover:border-slate-700 hover:bg-slate-900/60"
          }`;

          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-white">{item.label}</span>
                <NavStatus status={item.status} />
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
            </>
          );

          if (!item.href) {
            return (
              <div key={item.id} className="rounded-md border border-slate-800 bg-slate-950/35 p-3 opacity-80">
                {content}
              </div>
            );
          }

          return (
            <Link key={item.id} href={item.href} className={baseClass}>
              {content}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
