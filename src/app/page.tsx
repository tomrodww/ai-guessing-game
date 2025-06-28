import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StoryFilters } from '@/components/StoryFilters'
import { StoryCard } from '@/components/StoryCard'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { matchesDifficultyFilter } from '@/lib/difficulty'
import { Sparkles } from 'lucide-react'

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
    <div className="min-h-screen h-full bg-background-black overflow-y-auto">
      <Header />
      <main className="container mx-auto px-4 py-8 h-full">
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

async function StorySelection({ searchParams }: { searchParams: { theme?: string; difficulty?: string } }) {
  const resolvedSearchParams = searchParams
  
  // Get unique themes from stories
  const uniqueThemes = await prisma.story.findMany({
    where: { isActive: true },
    select: { theme: true },
    distinct: ['theme'],
    orderBy: { theme: 'asc' }
  })
  
  const themes = uniqueThemes.map(story => story.theme)

  // Build where clause for filtering
  const where: any = {
    isActive: true
  }

  if (resolvedSearchParams.theme) {
    where.theme = resolvedSearchParams.theme
  }

  // Fetch stories (we'll filter by difficulty on the client side)
  let stories = await prisma.story.findMany({
    where,
    include: {
      phrases: {
        select: {
          id: true
        }
      }
    },
    orderBy: [
      { theme: 'asc' },
      { title: 'asc' }
    ]
  })

  // Filter by difficulty using the centralized difficulty system
  if (resolvedSearchParams.difficulty) {
    stories = stories.filter(story => 
      matchesDifficultyFilter(story.phrases.length, resolvedSearchParams.difficulty!)
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-8">
        <StoryFilters
          themes={themes}
          selectedTheme={resolvedSearchParams.theme}
          selectedDifficulty={resolvedSearchParams.difficulty}
        />
      </div>

      {/* Stories Grid */}
      {stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <StoryCard story={story} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-muted-foreground mb-4">
              <Sparkles className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No stories found
            </h3>
            <Button asChild>
              <Link href="/">Clear Filters</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
} 