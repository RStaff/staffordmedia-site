type ContinuityItem = {
  label: string;
  value: string;
};

export default function RuntimeContinuityStrip({
  items,
  className = "",
}: {
  items: ContinuityItem[];
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 pt-3 md:px-6 ${className}`}>
      <div className="grid gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/45 p-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="border-l border-slate-700/70 pl-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
