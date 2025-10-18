export const metadata = {
  title: 'About – Stafford Media Consulting',
  description: 'We help ecommerce brands unlock ROI quickly with practical, low-risk AI.',
}

export default function AboutPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>About</h1>
      <p><strong>We help ecommerce brands unlock ROI quickly</strong> with practical, low-risk AI and conversion work. No redesigns, no big lifts — just focused changes that move the numbers.</p>

      <h2>What we believe</h2>
      <ul>
        <li><strong>Speed compounds.</strong> Weeks of drift kill momentum. We ship in days.</li>
        <li><strong>Clarity wins.</strong> Clean instrumentation beats vibes. We measure everything.</li>
        <li><strong>Voice matters.</strong> Copilots should sound like <em>you</em>, not a template.</li>
      </ul>

      <h2>Outcomes we focus on</h2>
      <ul>
        <li>More checkouts without a redesign</li>
        <li>Lifecycle messaging that actually converts (email/SMS/push/on-site)</li>
        <li>Lower CAC via tighter funnels and fewer leaks</li>
      </ul>

      <h2>How we work</h2>
      <ol>
        <li><strong>Quick Win Sprint (4 days):</strong> scope → implement → measure → iterate.</li>
        <li><strong>Monthly Accelerator:</strong> weekly experiments, compounding gains.</li>
        <li><strong>Advisory:</strong> senior guidance for in-house teams.</li>
      </ol>

      <h2>What clients say</h2>
      <blockquote>“We saw a 28% lift in checkout completion in the first week — without a redesign.”<br/><span className="text-sm text-brand-gray">— Ecommerce Director, DTC Apparel</span></blockquote>
      <blockquote>“They instrumented our funnel properly and found wins we’d missed for years.”<br/><span className="text-sm text-brand-gray">— Head of Growth, SaaS</span></blockquote>

      <p className="mt-6">
        Want results like these? <a className="font-semibold" href="/contact">Book a strategy call</a>.
      </p>
    </div>
  )
}
