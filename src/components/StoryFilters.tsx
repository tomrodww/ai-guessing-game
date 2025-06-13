'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Theme, Difficulty } from '@prisma/client'
import { formatDifficulty, getThemeColors, cn } from '@/lib/utils'
import { Filter, X } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Stories
          </CardTitle>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Difficulty Filter - Minimalist */}
          <div className="flex items-center gap-1">
            {(['SHORT', 'MEDIUM', 'LONG'] as Difficulty[]).map((difficulty, index) => {
              const isSelected = selectedDifficulty === difficulty
              
              return (
                <div key={difficulty} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({
                      theme: selectedTheme,
                      difficulty: isSelected ? undefined : difficulty
                    })}
                    className={cn(
                      'px-2 py-1 text-sm font-medium',
                      isSelected && 'text-primary underline'
                    )}
                  >
                    {formatDifficulty(difficulty)}
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
        </div>
      </CardContent>
    </Card>
  )
}