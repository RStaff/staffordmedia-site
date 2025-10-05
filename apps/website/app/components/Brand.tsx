import * as React from "react";

type SvgProps = React.SVGProps<SVGSVGElement>;

export function SMCMark({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="9" height="9" rx="2" fill="#B0B6BE" />
      <rect x="13" y="2" width="9" height="9" rx="2" fill="#8C2AC6" />
      <rect x="2" y="13" width="9" height="9" rx="2" fill="#0E2A57" />
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#B0B6BE" />
    </svg>
  );
}

export function AbandoMark({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      {/* cart handle + base */}
      <path
        d="M12 20h30c1.2 0 2.2.8 2.5 2l5 20c.4 1.6-.7 3.2-2.4 3.2H24"
        fill="none"
        stroke="#1E73F2"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* wheels */}
      <circle cx="26" cy="48" r="3" fill="#1E73F2" />
      <circle cx="42" cy="48" r="3" fill="#1E73F2" />
      {/* swirl/target */}
      <circle cx="40" cy="26" r="8" fill="#13A47B" />
      <circle cx="43.5" cy="22.8" r="3" fill="#13A47B" />
      <circle cx="40" cy="26" r="2.7" fill="#fff" />
    </svg>
  );
}
