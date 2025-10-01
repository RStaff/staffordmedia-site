import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
  eyebrow?: string;
  title?: string;
}>;

export default function Section({ className, children, eyebrow, title }: Props) {
  return (
    <section className={className}>
      {eyebrow && (
        <p className="mb-2 text-xs tracking-widest uppercase text-gray-500">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="mb-4 text-2xl font-semibold leading-tight text-gray-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
