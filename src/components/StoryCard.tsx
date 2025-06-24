import Image from 'next/image'
import { Story, Theme } from '@prisma/client'
import { getThemeColors, cn } from '@/lib/utils'
import { getDifficultyName, DIFFICULTY_LEVELS } from '@/lib/difficulty'
import { ChevronRight, Eye, Rocket, Hourglass } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StoryCardProps {
  story: Story & { 
    theme: Theme
    phrases: { id: string }[]
  }
}

const icons = {
  'Eye': Eye,
  'Rocket': Rocket,
  'Map': () => <Image src="/map.svg" alt="Adventure" width={16} height={16} />,
}

// Note: getDifficultyName is now imported from @/lib/difficulty

const DifficultyHourglasses = ({ level }: { level: string }) => {
  const difficultyNames = DIFFICULTY_LEVELS.map(d => d.name)
  const levelIndex = difficultyNames.indexOf(level)
  
  return (
    <div className="flex items-center gap-1">
      {DIFFICULTY_LEVELS.map((_, index) => (
        <Hourglass 
          key={index}
          className={cn(
            "h-3 w-3 transition-colors",
            index <= levelIndex
              ? "text-amber-500 fill-amber-500" 
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

export function StoryCard({ story }: StoryCardProps) {
  const IconComponent = icons[story.theme.icon as keyof typeof icons]
  const phraseCount = story.phrases.length
  const difficultyName = getDifficultyName(phraseCount)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
      <CardContent className="p-0">
        {/* Story Image */}
        <div className="relative h-8 rounded-t-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <div className="w-full h-full flex items-center justify-center">
          </div>
          
          {/* Theme Badge */}
          <div className="absolute top-2 left-3">
            {IconComponent && <IconComponent className="h-4 w-4" />}
          </div>
        </div>

        {/* Story Content */}
        <div className="p-4 space-y-3">
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
              <div className="flex items-center gap-2">
                <DifficultyHourglasses level={difficultyName} />
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