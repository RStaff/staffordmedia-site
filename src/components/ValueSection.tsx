'use client';

export default function ValueSection() {
  return (
    <section className="bg-gray-100 text-gray-900 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">What You Get</h2>
        <p className="text-lg md:text-xl mb-4">
          Stafford Media Consulting delivers scalable AI solutions, conversion-optimized web experiences, and automation-first workflows.
        </p>
        <ul className="text-left max-w-3xl mx-auto space-y-4 text-lg md:text-xl">
          <li>✅ Full-stack product architecture with clean, modular codebases</li>
          <li>✅ Conversion strategy baked into every layout and interaction</li>
          <li>✅ Zero-manual DevOps: CI/CD, environment automation, and CLI-first deployment</li>
          <li>✅ AI integration expertise — from LLMs to intelligent agents</li>
        </ul>
      </div>
    </section>
  );
}
