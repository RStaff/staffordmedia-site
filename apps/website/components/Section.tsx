import React from "react";
export default function Section({ title, eyebrow, children }:{
  title: string; eyebrow?: string; children: React.ReactNode;
}) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="space-y-6">
        {eyebrow && <div className="text-xs tracking-widest uppercase text-sky-400/80">{eyebrow}</div>}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
        <div className="prose prose-invert max-w-none">{children}</div>
      </div>
    </section>
  );
}
