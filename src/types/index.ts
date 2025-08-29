import { Story, StoryPhrase, PlayerQuestion } from '@prisma/client'

// Enhanced types with relations
export type StoryWithDetails = Story & {
  phrases: StoryPhrase[]
  playerQuestions?: PlayerQuestion[]
}

// Game response types
export interface QuestionResponse {
  answer: 'Yes' | 'No' | 'Irrelevant'
  explanation: string
  isPartialMatch: boolean
  phraseDiscovered?: {
    id: string
    order: number
    text: string
  }
  questionId?: string
  coinsEarned?: number  // Coins earned for revealing a phrase
  storyCompleted?: boolean
}

export interface QuestionHistory {
  question: string
  answer: 'Yes' | 'No' | 'Irrelevant'
  timestamp: Date
  explanation?: string
  phraseId?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}



export interface SolutionResponse {
  isCorrect: boolean
  explanation: string
  actualSolution?: string
  similarity?: number
}

// Filter types
export interface StoryFilters {
  theme?: string
  difficulty?: string
}

// Game state types
export interface GameState {
  storyId: string
  questions: QuestionHistory[]
  discoveredPhrases: string[] // IDs of discovered phrases
  startedAt: Date
  completedAt?: Date
  coins: number // Current coins
  hintsUnlocked: number[] // Array of unlocked hint indices
}

export interface GameSession {
  id: string
  storyId: string
  coins: number
  hintsUnlocked: number[]
  phrasesRevealed: number
  startedAt: Date
  completedAt?: Date
}



// Component prop types
export interface StoryCardProps {
  story: Story & { phrases: { id: string }[] }
  onClick: () => void
}

export interface FilterProps {
  themes: string[]
  selectedTheme?: string
  selectedDifficulty?: string
  onThemeChange: (theme?: string) => void
  onDifficultyChange: (difficulty?: string) => void
}

export interface GameInterfaceProps {
  story: StoryWithDetails
  initialGameState?: Partial<GameState>
}

// Utility types
export type { Story, StoryPhrase, PlayerQuestion } 