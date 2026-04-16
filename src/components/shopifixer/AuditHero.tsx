import ShopifixerLogo from "@/components/ShopifixerLogo";

export default function AuditHero() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow text-[var(--smc-accent)]">A Stafford Media Consulting service</p>
      <div className="mt-6">
        <ShopifixerLogo className="h-auto w-full max-w-[320px]" priority />
      </div>
      <h1 className="mt-6 text-[clamp(42px,6vw,62px)] font-semibold tracking-[-0.04em] text-white">
        Find the clearest conversion leak in your store.
      </h1>
      <p className="body-lg mt-6 max-w-3xl">
        ShopiFixer is a service-led audit built to surface the strongest issue first, show the evidence behind the
        read, and make the next fix obvious.
      </p>
    </div>
  );
}
