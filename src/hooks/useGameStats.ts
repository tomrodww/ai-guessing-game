import { useState, useEffect, useMemo } from 'react'

interface GameStats {
  progress: number
  totalPhrases: number
  discoveredCount: number
  gameStartTime: Date
  gameCompleted: boolean
}

interface UseGameStatsReturn extends GameStats {
  currentTime: Date
  formatDuration: (start: Date, end: Date) => string
}

export function useGameStats(
  gameSession: { discoveredPhrases: string[]; createdAt: Date } | null,
  totalPhrases: number
): UseGameStatsReturn {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second for timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const stats = useMemo(() => {
    if (!gameSession) {
      return {
        progress: 0,
        totalPhrases,
        discoveredCount: 0,
        gameStartTime: new Date(),
        gameCompleted: false
      }
    }

    const discoveredCount = gameSession.discoveredPhrases.length
    const progress = totalPhrases > 0 ? Math.round((discoveredCount / totalPhrases) * 100) : 0
    const gameCompleted = discoveredCount === totalPhrases && totalPhrases > 0

    return {
      progress,
      totalPhrases,
      discoveredCount,
      gameStartTime: gameSession.createdAt,
      gameCompleted
    }
  }, [gameSession, totalPhrases])

  const formatDuration = (start: Date, end: Date): string => {
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000)
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    ...stats,
    currentTime,
    formatDuration
  }
} 