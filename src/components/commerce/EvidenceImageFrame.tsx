"use client";

import { type ReactNode, useState } from "react";

export default function EvidenceImageFrame({
  imageUrl,
  ariaLabel,
  className,
  imageClassName = "object-contain object-top",
  fallbackTitle = "Storefront screenshot is not available yet.",
  fallbackCopy = "The audit result is still available below. Evidence review will stay tied to this store.",
  children,
}: {
  imageUrl?: string | null;
  ariaLabel: string;
  className: string;
  imageClassName?: string;
  fallbackTitle?: string;
  fallbackCopy?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !failed;

  return (
    <div aria-label={ariaLabel} className={className}>
      {showImage ? (
        <>
          <img
            src={imageUrl || ""}
            alt=""
            className={`absolute inset-0 h-full w-full ${imageClassName}`}
            onError={() => setFailed(true)}
          />
          {children}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] px-6 text-center">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-white">{fallbackTitle}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{fallbackCopy}</p>
          </div>
        </div>
      )}
    </div>
  );
}
