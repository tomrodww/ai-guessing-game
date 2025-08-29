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
    description: 'Dive into thrilling mysteries! Ask your questions to find the truth.',
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
                             <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Ask your questions. Find the truth<span className='text-blue-800'>.</span></span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Welcome to WhaHappen, an innovative AI-powered mystery-solving game that challenges your critical thinking skills. 
              Ask yes/no questions to uncover hidden stories, solve complex puzzles, and discover the truth behind each mystery. 
              Perfect for developing problem-solving abilities while having fun!
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Why Choose WhaHappen?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Intelligence</h3>
                <p className="text-muted-foreground">
                  Our advanced AI system understands your questions and provides intelligent responses, 
                  adapting to your skill level and learning style for a truly personalized experience.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Multiple Themes</h3>
                <p className="text-muted-foreground">
                  Choose from mystery, sci-fi, and adventure stories, each offering unique challenges 
                  and engaging narratives that keep you entertained and intellectually stimulated.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Skill Development</h3>
                <p className="text-muted-foreground">
                  Enhance your critical thinking, problem-solving, and logical reasoning skills 
                  through strategic questioning and systematic mystery solving.
                </p>
              </div>
            </div>
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