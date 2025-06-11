import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { GameInterface } from '@/components/GameInterface'

interface StoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
    include: { theme: true }
  })

  if (!story) {
    return {
      title: 'Story Not Found',
    }
  }

  return {
    title: `${story.title} - AI Guessing Game`,
    description: story.description,
    keywords: `AI, game, mystery, ${story.theme.name}, ${story.difficulty.toLowerCase()}`,
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const story = await prisma.story.findUnique({
    where: {
      id: params.id,
      isActive: true
    },
    include: {
      theme: true,
      blocks: {
        include: {
          discoveries: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  })

  if (!story) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GameInterface story={story} />
    </div>
  )
} 