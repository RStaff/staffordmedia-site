"use client";
import Image from "next/image";

export default function AbandoTitle() {
  return (
    <div data-testid="abando-title" className="flex items-center gap-3">
      <Image src="/abando-logo.png" width={28} height={28} className="h-5 w-5 align-[-2px]" alt="Abando" priority />
      <span className="text-white font-semibold text-xl">Abando</span>
    </div>
  );
}
