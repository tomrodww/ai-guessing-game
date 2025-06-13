import Image from 'next/image'
import { Story, Theme } from '@prisma/client'
import { formatDifficulty, getThemeColors, cn } from '@/lib/utils'
import { Clock, Users, ChevronRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StoryCardProps {
  story: Story & { 
    theme: Theme
    phrases: { id: string }[]
  }
}

export function StoryCard({ story }: StoryCardProps) {
  const IconComponent = Icons[story.theme.icon as keyof typeof Icons] as any
  const colors = getThemeColors(story.theme.color)
  const phraseCount = story.phrases.length

  // Estimate reading time based on difficulty
  const estimatedTime = {
    SHORT: '5-10 min',
    MEDIUM: '15-25 min',
    LONG: '30-45 min'
  }[story.difficulty]

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-0">
        {/* Story Image */}
        <div className="relative h-48 rounded-t-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50">
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
            <Badge variant="secondary" className={cn('flex items-center gap-1', colors.bg, colors.text)}>
              {IconComponent && <IconComponent className="h-3 w-3" />}
              {story.theme.name}
            </Badge>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              {formatDifficulty(story.difficulty)}
            </Badge>
          </div>
        </div>

        {/* Story Content */}
        <div className="p-6 space-y-3">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {story.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-2 line-clamp-3 leading-relaxed">
              {story.context}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{phraseCount} phrases</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
              <span>Play</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 