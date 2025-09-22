'use client';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-black text-white py-20 px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Ross Stafford | AI Consulting & Intelligent Automation
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Founder of Stafford Media Consulting and creator of{' '}
        <a href={process.env.NEXT_PUBLIC_ABANDO_URL} className="underline text-blue-400">
          Abando.ai
        </a>{' '}
        — the AI copilot for cart recovery.
      </p>
      <div className="flex justify-center gap-4">
        <a
          href={process.env.NEXT_PUBLIC_ABANDO_URL}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Explore Abando.ai
        </a>
        <a
          href={process.env.NEXT_PUBLIC_CALENDLY_URL}
          className="bg-white text-gray-900 font-semibold py-2 px-4 rounded"
        >
          Work with Ross
        </a>
      </div>
    </section>
  );
}
