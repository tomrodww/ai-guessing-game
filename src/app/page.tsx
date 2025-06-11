import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StoryFilters } from '@/components/StoryFilters'
import { StoryCard } from '@/components/StoryCard'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Uncover the{' '}
              <span className="text-gradient">Mystery</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Ask yes/no questions to solve puzzles, uncover secrets, and reveal hidden stories. 
              Each question brings you closer to the truth in these AI-powered interactive mysteries.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
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
  // Fetch themes for filtering
  const themes = await prisma.theme.findMany({
    orderBy: { name: 'asc' }
  })

  // Build where clause for filtering
  const where: any = {
    isActive: true
  }

  if (searchParams.theme) {
    where.themeId = searchParams.theme
  }

  if (searchParams.difficulty) {
    where.difficulty = searchParams.difficulty
  }

  // Fetch filtered stories
  const stories = await prisma.story.findMany({
    where,
    include: {
      theme: true,
      blocks: {
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
          selectedTheme={searchParams.theme}
          selectedDifficulty={searchParams.difficulty}
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
            <div className="text-gray-400 mb-4">
              <Sparkles className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to find more stories, or{' '}
              <Link href="/create" className="text-primary-600 hover:underline">
                create a new one
              </Link>
              .
            </p>
            <Link href="/" className="btn-primary">
              Clear Filters
            </Link>
          </div>
        </div>
      )}
    </>
  )
} 