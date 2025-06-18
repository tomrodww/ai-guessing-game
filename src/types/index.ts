import { Theme, Story, StoryPhrase, PlayerAffirmation } from '@prisma/client'

// Enhanced types with relations
export type ThemeWithStories = Theme & {
  stories: Story[]
}

export type StoryWithDetails = Story & {
  theme: Theme
  phrases: StoryPhrase[]
  playerAffirmations?: PlayerAffirmation[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface AffirmationResponse {
  answer: 'Yes' | 'No' | 'Irrelevant'
  explanation?: string
  affirmationId?: string  // ID of the saved affirmation
  phraseDiscovered?: {
    id: string
    order: number
    text: string
  }
  storyCompleted?: boolean
  isPartialMatch?: boolean  // Whether the answer is correct but not specific enough
  coinsEarned?: number  // Coins earned for revealing a phrase
  totalCoins?: number   // Current total coins
}

export interface SolutionResponse {
  isCorrect: boolean
  explanation: string
  actualSolution?: string
  similarity?: number
}

// Filter types
export interface StoryFilters {
  themeId?: string
  difficulty?: string
}

// Game state types
export interface GameState {
  storyId: string
  affirmations: AffirmationHistory[]
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

export interface AffirmationHistory {
  affirmation: string
  answer: 'Yes' | 'No' | 'Irrelevant'
  timestamp: Date
  explanation?: string
  phraseId?: string // If this affirmation relates to a specific phrase
  isUsed?: boolean // If the related phrase has been fully discovered
}

// Component prop types
export interface StoryCardProps {
  story: Story & { theme: Theme }
  onClick: () => void
}

export interface FilterProps {
  themes: Theme[]
  selectedTheme?: string
  selectedDifficulty?: string
  onThemeChange: (themeId?: string) => void
  onDifficultyChange: (difficulty?: string) => void
}

export interface GameInterfaceProps {
  story: StoryWithDetails
  initialGameState?: Partial<GameState>
}

// Utility types
export type { Theme, Story, StoryPhrase, PlayerAffirmation } 