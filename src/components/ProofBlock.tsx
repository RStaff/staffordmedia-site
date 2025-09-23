import React from "react";

export interface ProofBlockProps {
  icon: string;
  title: string;
  items: string[];
}

export default function ProofBlock({ icon, title, items }: ProofBlockProps) {
  return (
    <section className="proofblock">
      <h2>{title}</h2>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
