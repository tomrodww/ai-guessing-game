import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WhaHappen',
  description: 'Dive into thrilling mysteries! Make your statement to find the truth.',
  keywords: 'AI, game, mystery, story, guessing, interactive, puzzle, detective',
  authors: [{ name: 'WEC Team' }],
  viewport: 'width=device-width, initial-scale=1',
  
  // Open Graph tags for social media sharing
  openGraph: {
    title: 'WhaHappen - Find the truth',
    description: 'Dive into thrilling mysteries! Make your statement to find the truth.',
    url: 'https://whathappen.org',
    siteName: 'WhaHappen',
    type: 'website',
    locale: 'en_US',
  },
  
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: 'WhaHappen - Find the truth',
    description: 'Dive into thrilling mysteries! Make your statement to find the truth.',
    site: '@whathappen',
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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