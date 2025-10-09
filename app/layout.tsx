import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Stafford Media Consulting',
  description: 'AI-powered digital marketing and automation by Ross Stafford',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  )
}
