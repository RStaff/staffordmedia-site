import './globals.css';
import React from 'react';
import Header from '@/components/Header';

export const metadata = {
  title: 'Stafford Media Consulting™',
  description: 'AI-first consulting & automation—unlock 4× ROI in days.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
