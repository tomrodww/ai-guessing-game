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
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
} 