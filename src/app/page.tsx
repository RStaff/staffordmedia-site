export default function Home() {
  return (
    <main className="px-6 py-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold">Stafford Media Consulting</h1>
        <p className="text-lg text-gray-600 mt-2">AI Consulting & Intelligent Automation</p>
        <p className="text-sm text-gray-500 mt-4">
          Founded by Ross Stafford, creator of Abanado.ai — the AI copilot for cart recovery.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/abanado" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Abanado.ai
          </a>
          <a href="/contact" className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
            Work with Us
          </a>
        </div>
      </section>
    </main>
  );
}
