import React from "react";

export interface HeroProps {
  headline: string;
  subhead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export default function Hero({
  headline,
  subhead,
  primaryCta,
  secondaryCta
}: HeroProps) {
  return (
    <section className="hero-stub">
      <h1>{headline}</h1>
      <p>{subhead}</p>
      <div className="cta-group">
        <a href={primaryCta.href}>{primaryCta.label}</a>
        <a href={secondaryCta.href}>{secondaryCta.label}</a>
      </div>
    </section>
  );
}
