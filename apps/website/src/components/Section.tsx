import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export default function Section({ className, children }: Props) {
  return <section className={className}>{children}</section>;
}
