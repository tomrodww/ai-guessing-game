import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StoryFilters } from '@/components/StoryFilters'
import { StoryCard } from '@/components/StoryCard'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Play, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Guessing Game - Choose Your Mystery',
  description: 'Select from various mystery, sci-fi, and adventure stories to begin your AI-powered guessing adventure',
}

interface HomePageProps {
  searchParams: {
    theme?: string
    difficulty?: 'SHORT' | 'MEDIUM' | 'LONG'
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
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Uncover the{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Mystery</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Ask yes/no questions to solve puzzles, uncover secrets, and reveal hidden stories. 
              Each question brings you closer to the truth in these AI-powered interactive mysteries.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span>Interactive Stories</span>
              </div>
            </div>
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

  if (resolvedSearchParams.difficulty) {
    where.difficulty = resolvedSearchParams.difficulty
  }

  // Fetch filtered stories
  const stories = await prisma.story.findMany({
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
      { difficulty: 'asc' },
      { title: 'asc' }
    ]
  })

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
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to find more stories.
            </p>
            <Button asChild>
              <Link href="/">Clear Filters</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
} 