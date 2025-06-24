import Link from 'next/link'
import { ArrowLeft, Coins, Target, Clock, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDifficultyColors } from '@/lib/difficulty'

interface GameHeaderProps {
  story: {
    id: string
    title: string
    theme: { name: string; icon: string }
    phrases: any[]
  }
  coins: number
  discoveredCount: number
  totalPhrases: number
  gameTime: string
  gameCompleted: boolean
  onReset: () => void
}

// Icon mapping function (copied from original)
const getThemeIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    // You can add your icon imports here
  }
  return iconMap[iconName] || Target
}

export function GameHeader({
  story,
  coins,
  discoveredCount,
  totalPhrases,
  gameTime,
  gameCompleted,
  onReset
}: GameHeaderProps) {
  const colors = getDifficultyColors(totalPhrases)
  const IconComponent = getThemeIcon(story.theme.icon)
  const difficultyName = totalPhrases <= 5 ? 'Easy' : totalPhrases <= 10 ? 'Medium' : 'Hard'

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="mt-1">Back</span>
            </Link>
            
            <div className="h-6 w-px bg-border" />
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground text-xl mt-1">
                  {story.title}
                  <span className="text-sm text-muted-foreground"> • {difficultyName}</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Game stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 font-medium mt-1">{coins}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4 text-green-500" />
              <span className="mt-1">{discoveredCount}/{totalPhrases}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="mt-1">{gameTime}</span>
            </div>

            {gameCompleted && (
              <button
                onClick={onReset}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  colors.bg, colors.text, "hover:opacity-80"
                )}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="mt-1">Play Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 