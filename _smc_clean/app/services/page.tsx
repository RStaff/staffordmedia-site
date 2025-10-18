export const metadata = {
  title: 'Services – Stafford Media Consulting',
  description: 'Strategic marketing services that ship fast and drive measurable ROI.',
}

export default function ServicesPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Services</h1>
      <p>We ship fast, measure everything, and keep your stack simple.</p>

      <h2>What we offer</h2>
      <ul>
        <li><strong>Conversion lifts without redesigns</strong> — targeted changes, measurable results.</li>
        <li><strong>Lifecycle messaging</strong> — email, SMS, push & on-site nudges that fit your brand.</li>
        <li><strong>AI copilot integration</strong> — your voice, your policies, your offers.</li>
        <li><strong>Analytics & instrumentation</strong> — clean events, clear KPIs, actionable dashboards.</li>
      </ul>

      <h2>Engagement models</h2>
      <ul>
        <li><strong>Quick Win Sprint (4 days):</strong> scope → implement → measure → iterate.</li>
        <li><strong>Monthly Accelerator:</strong> ongoing experiments & compounding wins.</li>
        <li><strong>Advisory:</strong> strategic guidance for in-house teams.</li>
      </ul>

      <p className="mt-6">
        Ready to move? <a className="font-semibold" href="/contact">Book a strategy call</a>.
      </p>
    </div>
  )
}
