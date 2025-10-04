import Link from "next/link";

export default function Thanks() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        You’re on the list 🎉
      </h1>
      <p className="mt-3 text-zinc-700 max-w-2xl">
        Thanks for your interest in Abando. We’ll reach out shortly with
        onboarding steps and a link to activate your flows.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/how-it-works"
          className="rounded-xl border px-5 py-3 text-sm font-medium"
        >
          See How It Works
        </Link>
        <Link
          href="/abando"
          className="rounded-xl border px-5 py-3 text-sm font-medium"
        >
          Back to Abando
        </Link>
      </div>
    </div>
  );
}
