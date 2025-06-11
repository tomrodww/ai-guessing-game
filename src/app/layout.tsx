import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Guessing Game',
  description: 'An AI-powered story guessing game where you uncover hidden mysteries through yes/no questions',
  keywords: 'AI, game, mystery, story, guessing, interactive',
  authors: [{ name: 'AI Guessing Game Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  )
} 