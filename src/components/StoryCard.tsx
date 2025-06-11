import Image from 'next/image'
import { Story, Theme } from '@prisma/client'
import { formatDifficulty, getThemeColors, cn } from '@/lib/utils'
import { Clock, Users, Star, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'

interface StoryCardProps {
  story: Story & { 
    theme: Theme
    blocks: { id: string }[]
  }
}

export function StoryCard({ story }: StoryCardProps) {
  const IconComponent = Icons[story.theme.icon as keyof typeof Icons] as any
  const colors = getThemeColors(story.theme.color)
  const blockCount = story.blocks.length

  // Estimate reading time based on difficulty
  const estimatedTime = {
    SHORT: '5-10 min',
    MEDIUM: '15-25 min',
    LONG: '30-45 min'
  }[story.difficulty]

  return (
    <div className="card-hover group">
      {/* Story Image */}
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {story.imageUrl ? (
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center',
            colors.bg
          )}>
            {IconComponent && (
              <IconComponent className={cn('h-16 w-16', colors.text)} />
            )}
          </div>
        )}
        
        {/* Theme Badge */}
        <div className="absolute top-3 left-3">
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            colors.bg,
            colors.text
          )}>
            {IconComponent && <IconComponent className="h-3 w-3" />}
            {story.theme.name}
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {formatDifficulty(story.difficulty)}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
            {story.title}
          </h3>
          <p className="text-gray-600 text-sm mt-2 text-truncate-3 leading-relaxed">
            {story.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{blockCount} blocks</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">
            <span>Play</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
} 