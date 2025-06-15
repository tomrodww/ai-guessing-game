import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get theme colors for UI components (dark mode optimized)
 */
export function getThemeColors(color: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string; primary: string }> = {
    purple: {
      bg: 'bg-purple-900/20',
      text: 'text-purple-300',
      border: 'border-purple-700',
      primary: 'purple'
    },
    blue: {
      bg: 'bg-blue-900/20',
      text: 'text-blue-300',
      border: 'border-blue-700',
      primary: 'blue'
    },
    green: {
      bg: 'bg-green-900/20',
      text: 'text-green-300',
      border: 'border-green-700',
      primary: 'green'
    },
    red: {
      bg: 'bg-red-900/20',
      text: 'text-red-300',
      border: 'border-red-700',
      primary: 'red'
    },
    yellow: {
      bg: 'bg-yellow-900/20',
      text: 'text-yellow-300',
      border: 'border-yellow-700',
      primary: 'yellow'
    }
  }

  return colorMap[color] || colorMap.purple
}

/**
 * Format duration for display
 */
export function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date()
  const diff = end.getTime() - startTime.getTime()
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}
 