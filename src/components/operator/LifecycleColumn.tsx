import LifecycleCard from "./LifecycleCard";

export type LifecycleCardData = {
  runtimeId: string;
  merchantId: string;
  storeDomain: string;
  lifecycleState: string;
  riskLevel: string;
  rollbackReady: boolean;
  replayable: boolean;
  mutationDepth: string;
  approvalState: string;
  runtimeOwner: string;
  latestEventSummary?: string;
};

type LifecycleColumnProps = {
  title: string;
  description: string;
  cards: LifecycleCardData[];
};

export default function LifecycleColumn({ title, description, cards }: LifecycleColumnProps) {
  return (
    <section className="flex min-h-[24rem] min-w-[18rem] flex-col rounded-lg border border-slate-800 bg-slate-950/60">
      <header className="border-b border-slate-800 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
          </div>
          <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-300">{cards.length}</span>
        </div>
      </header>

      <div className="grid flex-1 content-start gap-3 p-3">
        {cards.length > 0 ? (
          cards.map((card) => <LifecycleCard key={card.runtimeId} {...card} />)
        ) : (
          <div className="rounded-md border border-dashed border-slate-800 bg-slate-950/55 p-4">
            <p className="text-sm font-semibold text-slate-300">No merchants here.</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">No canonical runtime artifacts currently resolve to this state.</p>
          </div>
        )}
      </div>
    </section>
  );
}

