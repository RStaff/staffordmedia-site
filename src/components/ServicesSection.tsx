'use client';

export default function ServicesSection() {
  return (
    <section className="bg-white text-gray-900 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Services</h2>
        <p className="text-lg md:text-xl mb-8">
          Stafford Media Consulting helps founders and teams build smarter with AI-native workflows and modular product architecture.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2">AI Consulting</h3>
            <p>LLM strategy, agent ecosystems, and intelligent automation tailored to your business goals.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Product Development</h3>
            <p>Full-stack builds using Next.js, Tailwind, and CLI-first workflows — optimized for conversion and scale.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">DevOps & Deployment</h3>
            <p>Zero-manual CI/CD, environment automation, and scalable infra using Render, Deta, and GitHub Actions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
