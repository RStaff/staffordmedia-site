import './globals.css';
import React from 'react';
import Header from '@/components/Header';

export const metadata = {
  title: 'Stafford Media Consulting™',
  description: 'AI-first consulting & Abando.ai'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container-max">
          {children}
        </main>
      </body>
    </html>
  );
}
