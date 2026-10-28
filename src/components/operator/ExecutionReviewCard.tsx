import type { ReactNode } from "react";

type Tone = "neutral" | "good" | "warn" | "bad";

function toneClasses(tone: Tone) {
  if (tone === "good") return "border-emerald-500/25 bg-emerald-950/35 text-emerald-200";
  if (tone === "warn") return "border-amber-500/25 bg-amber-950/35 text-amber-200";
  if (tone === "bad") return "border-rose-500/25 bg-rose-950/35 text-rose-200";
  return "border-slate-700 bg-slate-900 text-slate-300";
}

export function reviewTone(value: string | boolean | undefined): Tone {
  if (value === true) return "good";
  if (value === false) return "warn";
  if (!value) return "neutral";

  const normalized = String(value).toUpperCase();
  if (["PASS", "APPROVED", "READY", "READY_FOR_MANUAL_EXECUTION", "WITHIN_LIMITS"].includes(normalized)) return "good";
  if (["BLOCKED", "REJECTED", "FAILED", "HIGH", "DRIFT_RISK"].includes(normalized)) return "bad";
  if (["UNKNOWN", "APPROVAL_PENDING", "BLOCKED_PENDING_APPROVAL", "NOT_REQUESTED", "READY_FOR_VALIDATION"].includes(normalized)) {
    return "warn";
  }
  return "neutral";
}

export function ReviewBadge({ value, tone }: { value: string | boolean; tone?: Tone }) {
  const label = typeof value === "boolean" ? (value ? "yes" : "no") : value;
  return <span className={`inline-flex rounded border px-2 py-1 text-xs font-semibold ${toneClasses(tone || reviewTone(value))}`}>{label}</span>;
}

export function ReviewField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-1 break-words text-sm text-slate-200">{value}</div>
    </div>
  );
}

export default function ExecutionReviewCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-5">
      {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">{eyebrow}</p> : null}
      <h2 className="mt-2 text-base font-semibold text-white">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

