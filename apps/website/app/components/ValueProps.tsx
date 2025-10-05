export default function ValueProps() {
  const items = [
    {
      t: "Automate",
      d: "Scheduled flows that respect your brand and timing windows.",
    },
    {
      t: "Intervene",
      d: "Jump in live when a high-value cart appears—right from your dashboard.",
    },
    {
      t: "Measure",
      d: "Clear attribution ties revenue to messages and discounts.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((i) => (
          <div key={i.t} className="rounded-2xl border p-6 bg-white">
            <div className="font-medium text-zinc-900">{i.t}</div>
            <p className="mt-2 text-sm text-zinc-600">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
