import React from "react";

export interface HeroProps {
  headline: string;
  subhead: string;
  primaryCta: { label: string; href: string; };
  secondaryCta: { label: string; href: string; };
}

export default function Hero({
  headline,
  subhead,
  primaryCta,
  secondaryCta
}: HeroProps) {
  return (
    <section className="hero-stub">
      {/* Hero stub - rendering headline for now */}
      <h1>{headline}</h1>
    </section>
  );
}
