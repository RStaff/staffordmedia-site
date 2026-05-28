import ShopifixerLogo from "@/components/ShopifixerLogo";

export default function AuditHero() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow text-[var(--smc-accent)]">A Stafford Media Consulting service</p>
      <div className="mt-6">
        <ShopifixerLogo className="h-auto w-full max-w-[320px]" priority />
      </div>
      <h1 className="mt-6 text-[clamp(42px,6vw,62px)] font-semibold tracking-[-0.04em] text-white">
        Find where buyers start to hesitate in your store.
      </h1>
      <p className="body-lg mt-6 max-w-3xl">
        ShopiFixer finds the clearest purchase-path issue and turns it into a focused fix you can review before launch.
      </p>
    </div>
  );
}
