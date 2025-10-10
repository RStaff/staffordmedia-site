export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Stafford Media Consulting™</h1>
      <p className="mt-4">Clean bootstrap app for Render. Tailwind v3 + PostCSS.</p>
      <ul className="list-disc ml-6 mt-4">
        <li>Status: <code>/api/status</code></li>
        <li>Robots: <code>/robots.txt</code></li>
        <li>Sitemap: <code>/sitemap.xml</code></li>
      </ul>
    </main>
  );
}
