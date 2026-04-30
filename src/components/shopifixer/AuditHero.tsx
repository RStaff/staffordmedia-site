import ShopifixerLogo from "@/components/ShopifixerLogo";

export default function AuditHero() {
  return (
    <div className="max-w-4xl">
      <p className="eyebrow text-[var(--smc-accent)]">A Stafford Media Consulting service</p>
      <div className="mt-6">
        <ShopifixerLogo className="h-auto w-full max-w-[320px]" priority />
      </div>
      <h1 className="mt-6 text-[clamp(42px,6vw,62px)] font-semibold tracking-[-0.04em] text-white">
        Find the exact conversion leak costing you revenue — and fix it first.
      </h1>

<p className="mt-4 text-sm text-slate-300 max-w-xl">
Most stores don’t need more traffic first. They need to know what is breaking conversion.
</p>

      <p className="body-lg mt-6 max-w-3xl">
        ShopiFixer reviews your storefront, identifies the strongest conversion issue first, shows the evidence behind
        the read, and gives you the first fix worth testing.
      </p>
    </div>
  );
}
