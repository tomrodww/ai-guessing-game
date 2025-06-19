import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { GameInterface } from '@/components/GameInterface'
import { getDifficultyName } from '@/lib/difficulty'
import { StoryWithDetails } from '@/types'

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
      phrases: {
        select: { id: true } // Only need count for metadata
      }
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
  
  // Only fetch basic story info and theme, not the actual phrase texts
  const story = await prisma.story.findUnique({
    where: {
      id: resolvedParams.id,
      isActive: true
    },
    include: {
      theme: true,
      phrases: {
        select: {
          id: true,
          order: true,
          storyId: true,
          createdAt: true
          // Deliberately NOT selecting 'text' field for security
        },
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!story) {
    notFound()
  }

  // Transform the story to include phrase placeholders without text
  // We need the actual phrase structure to create proper placeholders
  const actualPhrases = await prisma.storyPhrase.findMany({
    where: { storyId: story.id },
    select: { id: true, order: true, text: true },
    orderBy: { order: 'asc' }
  })

  const secureStory: StoryWithDetails = {
    ...story,
    phrases: story.phrases.map(phrase => {
      const actualPhrase = actualPhrases.find(p => p.id === phrase.id)
      const actualText = actualPhrase?.text || ''
      
      // Convert each character to a square, preserving spaces and punctuation
      const placeholder = actualText
        .split('')
        .map(char => {
          if (char === ' ') return ' '
          if (char === '.' || char === ',' || char === '!' || char === '?' || char === ':' || char === ';' || char === "'" || char === '"') return char
          return '█' // Square character
        })
        .join('')

      return {
        id: phrase.id,
        order: phrase.order,
        storyId: phrase.storyId,
        createdAt: phrase.createdAt,
        text: placeholder
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GameInterface story={secureStory} />
    </div>
  )
} 