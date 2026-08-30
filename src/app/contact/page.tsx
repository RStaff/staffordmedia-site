'use client';

export default function ContactPage() {
  return (
    <main className="bg-white text-gray-900 py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Stafford Media Consulting</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Tell us what you want to improve</h1>
        <p className="text-lg md:text-xl mb-8">
          Tell us about a workflow, follow-up problem, or business process that is taking more time than it should.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Book a Strategy Call
          </a>
          <a
            href={"mailto:" + process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
          >
            Email Stafford Media
          </a>
        </div>
      </div>
    </main>
  );
}
