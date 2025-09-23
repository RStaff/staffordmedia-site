import React from "react";

export interface ProofBlockProps {
  icon: string;
  title: string;
  items: string[];
}

export default function ProofBlock({
  icon,
  title,
  items
}: ProofBlockProps) {
  return (
    <section className="proofblock-stub">
      <span className="icon">{icon}</span>
      <h2>{title}</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
