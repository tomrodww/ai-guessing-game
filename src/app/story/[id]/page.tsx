import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { GameInterface } from '@/components/GameInterface'
import { getDifficultyName } from '@/lib/difficulty'

interface StoryPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const story = await prisma.story.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      theme: true,
      phrases: true
    }
  })

  if (!story) {
    return {
      title: 'Story Not Found',
    }
  }

  return {
    title: `${story.title} | WhaHappen`,
    description: story.context,
    keywords: `AI, game, mystery, ${story.theme.name}, ${getDifficultyName(story.phrases.length)}`,
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const resolvedParams = await params
  const story = await prisma.story.findUnique({
    where: {
      id: resolvedParams.id,
      isActive: true
    },
    include: {
      theme: true,
      phrases: {
        orderBy: { order: 'asc' }
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