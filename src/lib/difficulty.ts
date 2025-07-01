export interface DifficultyLevel {
  name: string
  minPhrases: number
  maxPhrases: number
  value: string
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    name: 'Watson',
    minPhrases: 1,
    maxPhrases: 5,
    value: 'watson'
  },
  {
    name: 'Holmes',
    minPhrases: 6,
    maxPhrases: 8,
    value: 'holmes'
  },
  {
    name: 'Moriarty',
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
