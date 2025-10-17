"use client";
import Image from "next/image";

export default function AbandoTitle() {
  return (
    <div data-testid="abando-title" className="flex items-center gap-3">
      <Image src="/abando-logo.png" width="{18}" height="{18}" className="h-5 w-5 align-\[-2px\]" alt="Abando" width={28} height={28} priority />
      <span className="text-white font-semibold text-xl">Abando</span>
    </div>
  );
}
