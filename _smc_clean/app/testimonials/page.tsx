export const metadata = {
  title: 'Testimonials – Stafford Media Consulting',
  description: 'What clients say about working with Stafford Media Consulting.',
}

const quotes = [
  {
    quote: "We saw a 28% lift in checkout completion in the first week — without a redesign.",
    author: "Ecommerce Director, DTC Apparel",
  },
  {
    quote: "They instrumented our funnel properly and found wins we’d missed for years.",
    author: "Head of Growth, SaaS",
  },
  {
    quote: "Fast, pragmatic, and clear. The weekly experiments paid for the engagement.",
    author: "Founder, Consumer Brand",
  },
]

export default function TestimonialsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold tracking-tight">Testimonials</h1>
      <p className="text-brand-gray mt-3">Selective quotes from recent work.</p>

      <div className="mt-8 space-y-6">
        {quotes.map((q, i) => (
          <blockquote key={i} className="card p-5">
            <p className="text-lg">“{q.quote}”</p>
            <footer className="mt-2 text-sm text-brand-gray">— {q.author}</footer>
          </blockquote>
        ))}
      </div>

      <p className="mt-8">
        Want results like these? <a className="font-semibold" href="/contact">Book a strategy call</a>.
      </p>
    </div>
  )
}
