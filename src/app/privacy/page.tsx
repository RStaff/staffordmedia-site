import Link from "next/link";

export const metadata = {
  title: "Privacy - Stafford Media Consulting",
  description: "How Stafford Media Consulting uses optional website analytics.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="eyebrow text-[var(--smc-accent)]">Privacy</p>
      <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">Website analytics choices</h1>
      <div className="mt-8 grid gap-6 text-base leading-8 text-slate-300">
        <p>
          Stafford Media uses Google Analytics only after you affirmatively accept analytics. Its purpose is to understand aggregate website and conversion-funnel activity so we can improve the usefulness of the site.
        </p>
        <section>
          <h2 className="text-xl font-semibold text-white">What may be measured</h2>
          <p className="mt-2">
            Page routes, allowed campaign attribution fields, and fixed interaction events such as starting the automation assessment, viewing a result, choosing contact, starting Blueprint checkout, or selecting the email action.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">What is excluded</h2>
          <p className="mt-2">
            We do not send submitted names, email addresses, phone numbers, workflow descriptions, form answers, session-storage contents, Stripe or payment details, or StaffordOS and customer identifiers to Google Analytics.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-white">Your control</h2>
          <p className="mt-2">
            Accept and Decline are equally available. You can reopen Analytics preferences from any page and change or withdraw your choice. Declining analytics does not limit the website, assessment, contact, or checkout experience.
          </p>
        </section>
      </div>
      <Link href="/" className="smc-button smc-button-secondary mt-10">Return home</Link>
    </main>
  );
}
