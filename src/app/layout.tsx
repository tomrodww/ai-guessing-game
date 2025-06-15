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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Special Elite', monospace" }}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
} 