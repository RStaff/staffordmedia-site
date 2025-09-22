'use client';

export default function AboutSection() {
  return (
    <section className="bg-white text-gray-900 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">About Ross Stafford</h2>
        <p className="text-lg md:text-xl mb-4">
          Ross is a hands-on founder, AI consultant, and architect of scalable tech solutions.
          He leads Stafford Media Consulting with a focus on ownership, efficiency, and clarity —
          blending full-stack engineering with strategic business thinking.
        </p>
        <p className="text-lg md:text-xl">
          Whether launching AI products like <a href={process.env.NEXT_PUBLIC_ABANDO_URL} className="underline text-blue-600">Abando.ai</a> or optimizing conversion funnels,
          Ross builds with modularity, automation, and future-proofing in mind.
        </p>
      </div>
    </section>
  );
}
