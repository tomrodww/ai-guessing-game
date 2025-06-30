import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { StorySelection } from '@/components/StorySelection'

export const metadata: Metadata = {
  title: 'WhaHappen - Find the truth',
  description: 'Select a story to begin discovering',
  
  // Open Graph tags for social media sharing
  openGraph: {
    title: 'WhaHappen - Find the truth',
    description: 'Dive into thrilling mysteries! Make your statement to find the truth.',
    url: 'https://whathappen.org',
    siteName: 'WhaHappen',
    type: 'website',
  },
  
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: 'WhaHappen - Find the truth',
    description: 'Dive into thrilling mysteries! Select from detective puzzles, sci-fi enigmas, and adventure stories.',
  },
}

interface HomePageProps {
  searchParams: Promise<{
    theme?: string
    difficulty?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <div className="container mx-auto min-h-screen bg-background w-screen">
      <main className="px-4 py-8 h-full max-w-7xl mx-auto">
        {/* Hero Section */}
        <section id="hero" className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Make your statement. Find the truth<span className='text-blue-800'>.</span></span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              
            </p>
          </div>
        </section>

        {/* Story Selection */}
        <section id="stories">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <StorySelection searchParams={resolvedSearchParams} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  )
}