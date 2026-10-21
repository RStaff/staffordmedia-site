type OperatorTopbarProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

function Pill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "internal" | "public" }) {
  const tones = {
    neutral: "border-slate-700 bg-slate-900 text-slate-300",
    internal: "border-amber-500/25 bg-amber-950/30 text-amber-200",
    public: "border-cyan-500/25 bg-cyan-950/30 text-cyan-200",
  };

  return <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>;
}

export default function OperatorTopbar({ title, description, eyebrow = "StaffordOS" }: OperatorTopbarProps) {
  return (
    <header className="rounded-lg border border-slate-800 bg-slate-950/80 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">{eyebrow}</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill label="StaffordOS Operator" tone="internal" />
          <Pill label="Read only" />
          <Pill label="Public surfaces separate" tone="public" />
        </div>
      </div>
    </header>
  );
}
