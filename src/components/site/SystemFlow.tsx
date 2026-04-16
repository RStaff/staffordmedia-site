import AbandoTitle from "@/components/AbandoTitle";
import ShopifixerLogo from "@/components/ShopifixerLogo";

const cards = [
  {
    label: "1. Diagnose",
    title: "ShopiFixer",
    body: "See the clearest conversion issue first.",
    accent: "text-[var(--smc-shopifixer-green)]",
    type: "shopifixer",
  },
  {
    label: "2. Fix",
    title: "Highest-impact issue",
    body: "Focus on the one change most likely to move revenue.",
    accent: "text-[var(--smc-accent)]",
    type: "fix",
  },
  {
    label: "3. Recover",
    title: "Abando",
    body: "Recover lost revenue automatically from the shoppers who still leave.",
    accent: "text-[var(--smc-shopifixer-violet)]",
    type: "abando",
  },
];

export default function SystemFlow() {
  return (
    <section className="section-pad pt-0">
      <div className="site-shell">
        <div className="max-w-3xl">
          <p className="eyebrow text-slate-400">The system</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            One system from diagnosis to revenue recovery.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="premium-panel-soft p-6">
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${card.accent}`}>{card.label}</p>
              <div className="mt-5 min-h-[32px]">
                {card.type === "shopifixer" ? (
                  <ShopifixerLogo className="h-auto w-full max-w-[180px]" />
                ) : card.type === "abando" ? (
                  <AbandoTitle />
                ) : (
                  <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                )}
              </div>
              {card.type !== "fix" ? null : <h3 className="mt-5 text-2xl font-semibold text-white">{card.title}</h3>}
              <p className="body-md mt-4">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
