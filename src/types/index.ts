import { Theme, Story, StoryBlock, Discovery, Difficulty } from '@prisma/client'

// Enhanced types with relations
export type ThemeWithStories = Theme & {
  stories: Story[]
}

export type StoryWithDetails = Story & {
  theme: Theme
  blocks: StoryBlockWithDiscoveries[]
}

export type StoryBlockWithDiscoveries = StoryBlock & {
  discoveries: Discovery[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface QuestionResponse {
  answer: 'Yes' | 'No' | 'Irrelevant'
  explanation?: string
  discoveryMade?: {
    fact: string
    blockId: string
  }
  blockCompleted?: boolean
  storyCompleted?: boolean
}

// Filter types
export interface StoryFilters {
  themeId?: string
  difficulty?: Difficulty
}

// Game state types
export interface GameState {
  storyId: string
  currentBlockIndex: number
  questions: QuestionHistory[]
  discoveries: string[] // IDs of discovered facts
  completedBlocks: string[] // IDs of completed blocks
  startedAt: Date
  completedAt?: Date
}

export interface QuestionHistory {
  question: string
  answer: 'Yes' | 'No' | 'Irrelevant'
  timestamp: Date
  explanation?: string
}

// Component prop types
export interface StoryCardProps {
  story: Story & { theme: Theme }
  onClick: () => void
}

export interface FilterProps {
  themes: Theme[]
  selectedTheme?: string
  selectedDifficulty?: Difficulty
  onThemeChange: (themeId?: string) => void
  onDifficultyChange: (difficulty?: Difficulty) => void
}

export interface GameInterfaceProps {
  story: StoryWithDetails
  initialGameState?: Partial<GameState>
}

// Utility types
export { Difficulty, Theme, Story, StoryBlock, Discovery } 