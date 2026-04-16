const cards = [
  { label: "What you get", value: "Top issue, estimated upside, and evidence." },
  {
    label: "How it works",
    value: "Submit your store and email, then review the same engine-backed audit result sent to your inbox.",
  },
  { label: "Best current examples", value: "elkeyecoffee.com · luckettstore.com · dripaccessory.com" },
];

export default function AuditBenefitsRow() {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="premium-panel-soft p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">{card.label}</p>
          <p className="mt-3 text-sm leading-7 text-white/85">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
