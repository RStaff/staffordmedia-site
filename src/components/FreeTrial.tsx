import React from "react";

export interface FreeTrialProps {
  title: string;
  features: string[];
  cta: { label: string; href: string };
  disclaimer: string;
}

export default function FreeTrial({
  title,
  features,
  cta,
  disclaimer
}: FreeTrialProps) {
  return (
    <section className="freetrial-stub">
      <h2>{title}</h2>
      <ul>
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <p>{disclaimer}</p>
      <a href={cta.href}>{cta.label}</a>
    </section>
  );
}
