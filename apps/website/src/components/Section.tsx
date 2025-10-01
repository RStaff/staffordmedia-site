import React from "react";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f13d4d9 (fix(website): patch pricing flags for TS, align tsconfig + Section)
type Props = React.PropsWithChildren<{
  className?: string;
  eyebrow?: string;
  title?: string;
}>;
<<<<<<< HEAD

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
=======
type Props = React.PropsWithChildren<{ className?: string }>;

export default function Section({ className, children }: Props) {
  return <section className={className}>{children}</section>;
>>>>>>> 7454199 (chore(website): add minimal Section component to satisfy @ alias)
=======

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
>>>>>>> f13d4d9 (fix(website): patch pricing flags for TS, align tsconfig + Section)
}
