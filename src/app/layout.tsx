import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'WhaHappen',
  description: 'Dive into thrilling mysteries! Make your statement to find the truth.',
  keywords: 'AI, game, mystery, story, guessing, interactive, puzzle, detective',
  authors: [{ name: 'WEC Team' }],
  
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4VQP314BFN"></script>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4VQP314BFN');
            `,
          }}
        />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8337983525860754"
          crossOrigin="anonymous"
        />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap" rel="stylesheet" />
        
        {/* Favicon */}
        <link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo-icon.svg" />
        
      </head>
      <body className="antialiased" style={{ fontFamily: "'Special Elite', monospace" }}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
} 