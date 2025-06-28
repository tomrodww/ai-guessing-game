'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LEVELS } from '@/lib/difficulty'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoryFiltersProps {
  themes: string[]
  selectedTheme?: string
  selectedDifficulty?: string
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
    <div className='flex flex-row gap-2 justify-between max-md:flex-col max-md:items-center'>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-1">
        {DIFFICULTY_LEVELS.map((difficulty, index) => {
          const isSelected = selectedDifficulty === difficulty.value
          
          return (
            <div key={difficulty.value} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilters({
                  theme: selectedTheme,
                  difficulty: isSelected ? undefined : difficulty.value
                })}
                className={cn(
                  'px-2 py-1 text-sm font-medium',
                  isSelected && 'text-primary underline'
                )}
              >
                {difficulty.label}
              </Button>
              {index < DIFFICULTY_LEVELS.length - 1 && <span className="text-muted-foreground mx-1">|</span>}
            </div>
          )
        })}
      </div>

      {/* Theme Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Theme:</span>
        <select
          value={selectedTheme || ''}
          onChange={(e) => updateFilters({
            theme: e.target.value || undefined,
            difficulty: selectedDifficulty
          })}
          className="bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All</option>
          {themes.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="flex items-center gap-1"
        disabled={!hasFilters}
      >
        <X className="h-4 w-4" />
        Clear all
      </Button>
    </div>
  )
}