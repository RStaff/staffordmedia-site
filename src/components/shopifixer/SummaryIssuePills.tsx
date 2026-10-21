type SummaryIssuePillsProps = {
  issues: string[];
};

export default function SummaryIssuePills({ issues }: SummaryIssuePillsProps) {
  const topIssues = issues.slice(0, 3);

  return (
    <div className="flex flex-wrap gap-3">
      {topIssues.map((issue) => (
        <div
          key={issue}
          className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200"
        >
          {issue}
        </div>
      ))}
    </div>
  );
}
