export const metadata = {
  title: 'Book a Strategy Call – Stafford Media Consulting',
  description: 'Book a strategy call or email us. Fast, focused, and practical.',
}

const CALENDLY_URL = 'https://calendly.com/';           // ← replace with your real scheduling link
const CONTACT_EMAIL = 'info@staffordmedia.ai';           // ← replace with your real inbox

export default function ContactPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold tracking-tight">Book a Strategy Call</h1>
      <p className="text-brand-gray mt-3">
        Pick a time that works. Prefer email? Reach us at{' '}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <div className="mt-6 flex gap-3">
        <a className="btn-primary" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
          Book on Calendly
        </a>
        <a className="btn-ghost" href={`mailto:${CONTACT_EMAIL}`}>
          Email Us
        </a>
      </div>

      <div className="mt-8 card p-0 overflow-hidden">
        <div className="p-5 border-b border-[var(--brand-border)]">
          <h2 className="font-semibold">Or book right here</h2>
          <p className="text-sm text-brand-gray">Embedded scheduler (opens in a new tab if blocked).</p>
        </div>
        <div className="p-0">
          <iframe
            title="Schedule with Stafford Media Consulting"
            src={CALENDLY_URL}
            style={{ width: '100%', height: '720px', border: 0 }}
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-brand-gray">
        Having trouble with the embed? Use the button above or email us directly.
      </p>
    </div>
  )
}
