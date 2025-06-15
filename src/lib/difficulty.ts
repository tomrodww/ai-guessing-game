export interface DifficultyLevel {
  name: string
  label: string
  minPhrases: number
  maxPhrases: number
  value: string
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    name: 'Watson',
    label: 'Watson',
    minPhrases: 1,
    maxPhrases: 5,
    value: 'watson'
  },
  {
    name: 'Holmes',
    label: 'Holmes', 
    minPhrases: 6,
    maxPhrases: 8,
    value: 'holmes'
  },
  {
    name: 'Moriarty',
    label: 'Moriarty',
    minPhrases: 9,
    maxPhrases: 12,
    value: 'moriarty'
  }
]

/**
 * Get difficulty level name based on phrase count
 */
export function getDifficultyName(phraseCount: number): string {
  for (const level of DIFFICULTY_LEVELS) {
    if (phraseCount >= level.minPhrases && phraseCount <= level.maxPhrases) {
      return level.name
    }
  }
  return 'Unknown'
}

/**
 * Get difficulty level object based on phrase count
 */
export function getDifficultyLevel(phraseCount: number): DifficultyLevel | undefined {
  return DIFFICULTY_LEVELS.find(level => 
    phraseCount >= level.minPhrases && phraseCount <= level.maxPhrases
  )
}

/**
 * Get difficulty level by value (for filters)
 */
export function getDifficultyByValue(value: string): DifficultyLevel | undefined {
  return DIFFICULTY_LEVELS.find(level => level.value === value)
}

/**
 * Check if phrase count matches a specific difficulty filter
 */
export function matchesDifficultyFilter(phraseCount: number, filterValue: string): boolean {
  const difficulty = getDifficultyByValue(filterValue)
  if (!difficulty) return false
  
  return phraseCount >= difficulty.minPhrases && phraseCount <= difficulty.maxPhrases
} 