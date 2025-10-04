export default function ChartPlaceholder({
  label = "Chart placeholder",
}: {
  label?: string;
}) {
  return (
    <div className="mt-2 h-36 rounded-xl border smc-grid">
      <div className="h-full grid place-items-center text-zinc-400 text-sm">
        {label}
      </div>
    </div>
  );
}
