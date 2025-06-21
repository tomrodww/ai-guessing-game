import { useState, useEffect, useCallback } from 'react'

interface GameSession {
  id: string
  storyId: string
  coins: number
  discoveredPhrases: string[]
  createdAt: Date
}

interface UseGameSessionReturn {
  gameSession: GameSession | null
  isLoading: boolean
  error: string | null
  startNewSession: (storyId: string) => Promise<void>
  updateCoins: (newCoins: number) => void
  addDiscoveredPhrase: (phraseId: string) => void
  resetSession: () => void
}

export function useGameSession(storyId: string): UseGameSessionReturn {
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const startNewSession = useCallback(async (storyId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/game-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, forceNew: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to create game session')
      }

      const session = await response.json()
      setGameSession({
        id: session.id,
        storyId: session.storyId,
        coins: session.coins,
        discoveredPhrases: session.discoveredPhrases || [],
        createdAt: new Date(session.createdAt)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game session')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCoins = useCallback((newCoins: number) => {
    setGameSession(prev => prev ? { ...prev, coins: newCoins } : null)
  }, [])

  const addDiscoveredPhrase = useCallback((phraseId: string) => {
    setGameSession(prev => {
      if (!prev) return null
      if (prev.discoveredPhrases.includes(phraseId)) return prev
      return {
        ...prev,
        discoveredPhrases: [...prev.discoveredPhrases, phraseId]
      }
    })
  }, [])

  const resetSession = useCallback(() => {
    if (gameSession) {
      startNewSession(gameSession.storyId)
    }
  }, [gameSession, startNewSession])

  // Initialize session on mount
  useEffect(() => {
    if (storyId) {
      startNewSession(storyId)
    }
  }, [storyId, startNewSession])

  return {
    gameSession,
    isLoading,
    error,
    startNewSession,
    updateCoins,
    addDiscoveredPhrase,
    resetSession
  }
} 