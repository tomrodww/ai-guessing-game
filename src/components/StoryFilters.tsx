'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Theme } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoryFiltersProps {
  themes: Theme[]
  selectedTheme?: string
  selectedDifficulty?: string
}

const difficultyLevels = [
  { value: '3', label: 'Watson' },
  { value: '5', label: 'Holmes' },
  { value: '7', label: 'Moriarty' }
]

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
    <div className='flex flex-row gap-2 justify-between'>
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5" />
        <span className='text-sm font-medium'>Filters</span>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center gap-1">
        {difficultyLevels.map((difficulty, index) => {
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
              {index < 2 && <span className="text-muted-foreground mx-1">|</span>}
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
            <option key={theme.id} value={theme.id}>
              {theme.name}
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