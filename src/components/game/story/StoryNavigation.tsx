import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryNavigationProps {
  navigation: {
    previous: {
      id: string
      title: string
      themeName: string
    } | null
    next: {
      id: string
      title: string
      themeName: string
    } | null
    current: {
      index: number
      total: number
    }
  } | null
  isNavigating: boolean
  onNavigate: (storyId: string) => void
}

export function StoryNavigation({ navigation, isNavigating, onNavigate }: StoryNavigationProps) {
  if (!navigation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 h-8">
        <div className="flex justify-between items-center w-full h-8">
          <div className="flex overflow-hidden">
            <div className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground/50">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </div>
          </div>
          <div className="flex overflow-hidden h-8">
            <div className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground/50">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 h-8">
      <div className="flex justify-between items-center w-full h-8">
        {/* Left column - Previous */}
        <div className="flex overflow-hidden">
          {navigation.previous ? (
            <button
              onClick={() => onNavigate(navigation.previous!.id)}
              disabled={isNavigating}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
              title={`Previous: ${navigation.previous.title}`}
            >
              <ChevronLeft className={`w-4 h-4 flex-shrink-0 ${isNavigating ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline truncate">{navigation.previous.title}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground/50">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </div>
          )}
        </div>

        {/* Right column - Next */}
        <div className="flex overflow-hidden h-8">
          {navigation.next ? (
            <button
              onClick={() => onNavigate(navigation.next!.id)}
              disabled={isNavigating}
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0",
                isNavigating ? "animate-pulse" : ""
              )}
              title={`Next: ${navigation.next.title}`}
            >
              <span className="hidden sm:inline truncate">{navigation.next.title}</span>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isNavigating ? 'animate-pulse' : ''}`} />
            </button>
          ) : (
            <div className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground/50">
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 