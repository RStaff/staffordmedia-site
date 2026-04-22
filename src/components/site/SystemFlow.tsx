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
              <h3 className="mt-4 text-2xl font-semibold text-white">{card.title}</h3>
              <div className="mt-4 min-h-[56px] flex items-center">
                {card.type === "shopifixer" ? (
                  <ShopifixerLogo className="h-auto w-full max-w-[230px]" />
                ) : card.type === "abando" ? (
                  <AbandoTitle />
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                    <img src="/brand/smc-logo.inline.png" alt="Stafford Media Consulting" className="h-8 w-auto" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Stafford Media Consulting</p>
                      <p className="mt-1 text-sm text-slate-300">Implementation layer</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="body-md mt-4">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
