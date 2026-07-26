import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export type SystemStage = "diagnose" | "scope" | "review" | "approve" | "fix" | "complete";

type Stage = {
  id: SystemStage;
  number: string;
  label: string;
  tone: string;
  Icon: typeof MagnifyingGlassIcon;
};

const stages: Stage[] = [
  {
    id: "diagnose",
    number: "01",
    label: "Diagnose",
    tone: "text-amber-200 border-amber-300/35 bg-amber-400/10",
    Icon: MagnifyingGlassIcon,
  },
  {
    id: "scope",
    number: "02",
    label: "Scope",
    tone: "text-cyan-200 border-cyan-300/35 bg-cyan-400/10",
    Icon: ArrowRightIcon,
  },
  {
    id: "review",
    number: "03",
    label: "Review",
    tone: "text-teal-200 border-teal-300/35 bg-teal-400/10",
    Icon: ClipboardDocumentCheckIcon,
  },
  {
    id: "approve",
    number: "04",
    label: "Approve",
    tone: "text-blue-200 border-blue-300/35 bg-blue-400/10",
    Icon: WrenchScrewdriverIcon,
  },
  {
    id: "fix",
    number: "05",
    label: "Fix",
    tone: "text-emerald-200 border-emerald-300/35 bg-emerald-400/10",
    Icon: WrenchScrewdriverIcon,
  },
  {
    id: "complete",
    number: "06",
    label: "Complete",
    tone: "text-lime-200 border-lime-300/35 bg-lime-400/10",
    Icon: CheckCircleIcon,
  },
];

const stageIndex = new Map<SystemStage, number>(stages.map((stage, index) => [stage.id, index]));

export default function SystemProgressRail({
  currentStage,
  stateLabel,
  className = "",
}: {
  currentStage: SystemStage;
  stateLabel?: string;
  className?: string;
}) {
  const currentIndex = stageIndex.get(currentStage) ?? 0;

  return (
    <div className={`mx-auto w-full max-w-6xl px-5 pt-5 md:px-6 ${className}`}>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/78 p-3 shadow-lg shadow-black/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">ShopiFixer path</p>
            {stateLabel ? (
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200">
                {stateLabel}
              </span>
            ) : null}
          </div>

          <ol className="grid gap-2 sm:grid-cols-6 lg:min-w-[860px]">
            {stages.map((stage, index) => {
              const isCurrent = index === currentIndex;
              const isComplete = index < currentIndex;
              const isFuture = index > currentIndex;
              const Icon = stage.Icon;

              return (
                <li
                  key={stage.id}
                  className={[
                    "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2",
                    isCurrent ? stage.tone : "",
                    isComplete ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100" : "",
                    isFuture ? "border-slate-800 bg-slate-900/55 text-slate-500" : "",
                  ].join(" ")}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current/25 bg-black/15">
                    {isComplete ? <CheckCircleIcon className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] opacity-75">{stage.number}</span>
                    <span className="block truncate text-xs font-semibold">{stage.label}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
