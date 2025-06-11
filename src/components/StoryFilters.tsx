'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Theme, Difficulty } from '@prisma/client'
import { formatDifficulty, getThemeColors, cn } from '@/lib/utils'
import { Filter, X } from 'lucide-react'
import * as Icons from 'lucide-react'

interface StoryFiltersProps {
  themes: Theme[]
  selectedTheme?: string
  selectedDifficulty?: Difficulty
}

export function StoryFilters({ 
  themes, 
  selectedTheme, 
  selectedDifficulty 
}: StoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/')
  }

  const hasFilters = selectedTheme || selectedDifficulty

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Stories</h2>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Theme Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((theme) => {
              const IconComponent = Icons[theme.icon as keyof typeof Icons] as any
              const colors = getThemeColors(theme.color)
              const isSelected = selectedTheme === theme.id

              return (
                <button
                  key={theme.id}
                  onClick={() => updateFilters({
                    theme: isSelected ? undefined : theme.id,
                    difficulty: selectedDifficulty
                  })}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left',
                    isSelected
                      ? `${colors.bg} ${colors.text} ${colors.border}`
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {IconComponent && (
                    <IconComponent className="h-5 w-5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-medium">{theme.name}</div>
                    {theme.description && (
                      <div className={cn(
                        'text-xs mt-1',
                        isSelected ? 'opacity-80' : 'text-gray-500'
                      )}>
                        {theme.description}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['SHORT', 'MEDIUM', 'LONG'] as Difficulty[]).map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty
              
              return (
                <button
                  key={difficulty}
                  onClick={() => updateFilters({
                    theme: selectedTheme,
                    difficulty: isSelected ? undefined : difficulty
                  })}
                  className={cn(
                    'p-3 rounded-lg border-2 font-medium transition-all duration-200',
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {formatDifficulty(difficulty)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}