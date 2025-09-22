'use client';

export default function CallToAction() {
  return (
    <section className="bg-blue-900 text-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Let’s Build What Matters</h2>
        <p className="text-lg md:text-xl mb-8">
          Whether you're launching a product, optimizing conversions, or integrating AI — Stafford Media Consulting helps you move fast and build smart.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL}
            aria-label="Book a call with Ross"
            className="bg-white text-blue-900 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition"
          >
            Book a Call
          </a>
          <a
            href={"mailto:" + process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            aria-label="Email Ross Stafford"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Contact Ross
          </a>
          <a
            href={process.env.NEXT_PUBLIC_ABANDO_URL}
            aria-label="Explore Abando.ai"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Explore Abando.ai
          </a>
        </div>
      </div>
    </section>
  );
}
