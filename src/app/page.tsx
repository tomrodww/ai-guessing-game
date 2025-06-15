import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StoryFilters } from '@/components/StoryFilters'
import { StoryCard } from '@/components/StoryCard'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Guessing Game - Choose Your Mystery',
  description: 'Select from various mystery, sci-fi, and adventure stories to begin your AI-powered guessing adventure',
}

interface HomePageProps {
  searchParams: {
    theme?: string
    difficulty?: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Make your statement. Find the truth<span className='text-blue-800'>.</span></span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              
            </p>
          </div>
        </section>

        {/* Story Selection */}
        <section>
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <StorySelection searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  )
}

async function StorySelection({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  
  // Fetch themes for filtering
  const themes = await prisma.theme.findMany({
    orderBy: { name: 'asc' }
  })

  // Build where clause for filtering
  const where: any = {
    isActive: true
  }

  if (resolvedSearchParams.theme) {
    where.themeId = resolvedSearchParams.theme
  }

  // Filter by difficulty (phrase count)
  if (resolvedSearchParams.difficulty) {
    const phraseCount = parseInt(resolvedSearchParams.difficulty)
    where.phrases = {
      some: {}
    }
  }

  // Fetch filtered stories
  let stories = await prisma.story.findMany({
    where,
    include: {
      theme: true,
      phrases: {
        select: {
          id: true
        }
      }
    },
    orderBy: [
      { theme: { name: 'asc' } },
      { title: 'asc' }
    ]
  })

  // Filter by phrase count on the client side if difficulty is selected
  if (resolvedSearchParams.difficulty) {
    const targetPhraseCount = parseInt(resolvedSearchParams.difficulty)
    stories = stories.filter(story => story.phrases.length === targetPhraseCount)
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