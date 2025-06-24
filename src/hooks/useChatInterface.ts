import { useState, useCallback } from 'react'

interface PlayerAffirmation {
  affirmation: string
  answer: 'Yes' | 'No' | 'Irrelevant'
  timestamp: Date
  explanation?: string
  phraseId?: string
}

interface UseChatInterfaceReturn {
  question: string
  setQuestion: (question: string) => void
  affirmations: PlayerAffirmation[]
  isSubmitting: boolean
  error: string | null
  submitQuestion: () => Promise<void>
  clearError: () => void
}

export function useChatInterface(
  gameSessionId: string | null,
  onPhraseDiscovered: (phraseId: string) => void,
  onCoinsUpdate: (newCoins: number) => void
): UseChatInterfaceReturn {
  const [question, setQuestion] = useState('')
  const [affirmations, setAffirmations] = useState<PlayerAffirmation[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitQuestion = useCallback(async () => {
    if (!question.trim() || !gameSessionId || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          gameSessionId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit question')
      }

      const result = await response.json()
      
      // Add the new affirmation to the list
      const newAffirmation: PlayerAffirmation = {
        affirmation: question.trim(),
        answer: result.answer,
        timestamp: new Date(),
        explanation: result.explanation,
        phraseId: result.phraseId
      }

      setAffirmations(prev => [newAffirmation, ...prev])
      
      // Update game state if phrase was discovered
      if (result.phraseId) {
        onPhraseDiscovered(result.phraseId)
      }
      
      // Update coins if provided
      if (typeof result.coins === 'number') {
        onCoinsUpdate(result.coins)
      }

      // Clear the question input
      setQuestion('')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit question')
    } finally {
      setIsSubmitting(false)
    }
  }, [question, gameSessionId, isSubmitting, onPhraseDiscovered, onCoinsUpdate])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    question,
    setQuestion,
    affirmations,
    isSubmitting,
    error,
    submitQuestion,
    clearError
  }
} 