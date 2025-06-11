import { clsx, type ClassValue } from 'clsx'

/**
 * Merge class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format difficulty enum to readable string
 */
export function formatDifficulty(difficulty: string): string {
  switch (difficulty) {
    case 'SHORT':
      return 'Short'
    case 'MEDIUM':
      return 'Medium'
    case 'LONG':
      return 'Long'
    default:
      return difficulty
  }
}

/**
 * Get theme color classes
 */
export function getThemeColors(themeColor: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    mystery: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-800'
    },
    scifi: {
      bg: 'bg-cyan-900',
      text: 'text-cyan-100',
      border: 'border-cyan-700',
      hover: 'hover:bg-cyan-800'
    },
    adventure: {
      bg: 'bg-amber-900',
      text: 'text-amber-100',
      border: 'border-amber-700',
      hover: 'hover:bg-amber-800'
    }
  }

  return colorMap[themeColor] || {
    bg: 'bg-gray-100',
    text: 'text-gray-900',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-200'
  }
}

/**
 * Calculate game progress percentage
 */
export function calculateProgress(
  completedBlocks: string[],
  totalBlocks: number
): number {
  return totalBlocks > 0 ? Math.round((completedBlocks.length / totalBlocks) * 100) : 0
}

/**
 * Format time duration
 */
export function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date()
  const diffMs = end.getTime() - startTime.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffSecs = Math.floor((diffMs % 60000) / 1000)

  if (diffMins > 0) {
    return `${diffMins}m ${diffSecs}s`
  }
  return `${diffSecs}s`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
} 