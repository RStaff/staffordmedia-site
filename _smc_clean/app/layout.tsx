import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stafford Media Consulting',
  description: 'Unlock 4× ROI in 4 days — no redesigns, no downtime.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-3xl p-6 text-zinc-900">
        <header className="mb-8">
          <a href="/" className="text-sm text-zinc-600 hover:underline">Stafford Media Consulting™</a>
        </header>
        {children}
        <footer className="mt-16 border-t pt-6 text-sm text-zinc-500">
          <div>© {new Date().getFullYear()} Stafford Media Consulting</div>
        </footer>
      </body>
    </html>
  );
}
