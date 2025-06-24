'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Target, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StoryWithDetails } from '@/types'
import { LoadingSpinner } from './LoadingSpinner'
import { GameHeader } from './game/GameHeader'
import { StoryNavigation } from './game/story/StoryNavigation'
import { useGameSession } from '@/hooks/useGameSession'
import { useStoryNavigation } from '@/hooks/useStoryNavigation'
import { useGameStats } from '@/hooks/useGameStats'
import { useChatInterface } from '@/hooks/useChatInterface'

interface GameInterfaceProps {
  story: StoryWithDetails
}

export function GameInterface({ story }: GameInterfaceProps) {
  const [revealedPhraseTexts, setRevealedPhraseTexts] = useState<Record<string, string>>({})

  // Initialize hooks
  const gameSession = useGameSession(story.id)
  const navigation = useStoryNavigation(story.id)
  const stats = useGameStats(gameSession.gameSession, story.phrases.length)
  const chat = useChatInterface(
    gameSession.gameSession?.id || null,
    gameSession.addDiscoveredPhrase,
    gameSession.updateCoins
  )

  // Fetch revealed phrase texts when discovered phrases change
  useEffect(() => {
    const fetchRevealedPhrases = async () => {
      if (!gameSession.gameSession?.id || gameSession.gameSession.discoveredPhrases.length === 0) {
        return
      }

      try {
        const response = await fetch(`/api/revealed-phrases?gameSessionId=${gameSession.gameSession.id}`)
        if (response.ok) {
          const phrases = await response.json()
          const phraseMap: Record<string, string> = {}
          phrases.forEach((phrase: any) => {
            phraseMap[phrase.id] = phrase.text
          })
          setRevealedPhraseTexts(phraseMap)
        }
      } catch (error) {
        console.error('Failed to fetch revealed phrases:', error)
      }
    }

    fetchRevealedPhrases()
  }, [gameSession.gameSession?.discoveredPhrases, gameSession.gameSession?.id])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      chat.submitQuestion()
    }
  }

  // Show loading state
  if (gameSession.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show error state
  if (gameSession.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Error: {gameSession.error}</div>
      </div>
    )
  }

  const coins = gameSession.gameSession?.coins || 0
  const discoveredPhrases = gameSession.gameSession?.discoveredPhrases || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <GameHeader
        story={story}
        coins={coins}
        discoveredCount={stats.discoveredCount}
        totalPhrases={stats.totalPhrases}
        gameTime={stats.formatDuration(stats.gameStartTime, stats.gameCompleted ? new Date() : stats.currentTime)}
        gameCompleted={stats.gameCompleted}
        onReset={gameSession.resetSession}
      />

      {/* Navigation */}
      <StoryNavigation
        navigation={navigation.navigation}
        isNavigating={navigation.isNavigating}
        onNavigate={navigation.navigateToStory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-border">
        {/* Main Game Area */}
        <div className="lg:col-span-2 lg:pr-4">
          {/* Story Context */}
          <div className="px-4 py-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 h-8">
                <BookOpen className="w-5 h-5 text-blue-800" />
                <h2 className="text-lg font-semibold text-foreground mt-1">Context</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed px-2">{story.context}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="p-2 px-4 flex items-center justify-between">
            <div className="w-full bg-muted rounded-full h-2 mx-2">
              <div 
                className="h-2 rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{stats.progress}%</span>
          </div>

          {/* Story Reveal */}
          <div className="border-b border-border">
            <div className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground mt-1">Story</h3>
              </div>
            </div>
            
            <div className="px-6 py-2">
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <div className="leading-relaxed text-foreground">
                    <div className="space-y-1">
                      {[...story.phrases]
                        .sort((a, b) => a.order - b.order)
                        .map((phrase) => {
                          const isDiscovered = discoveredPhrases.includes(phrase.id)
                          const actualText = revealedPhraseTexts[phrase.id] || phrase.text
                          
                          if (isDiscovered) {
                            return (
                              <span 
                                key={phrase.id}
                                className="text-green-200 px-1 py-0.5 rounded font-medium inline-block mr-1"
                              >
                                {actualText}
                              </span>
                            )
                          } else {
                            return (
                              <span 
                                key={phrase.id}
                                className="text-muted-foreground select-none inline-block mr-1 font-mono tracking-wide"
                                style={{ letterSpacing: '1px' }}
                              >
                                {phrase.text}
                              </span>
                            )
                          }
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground">Make Your statement</h3>
            </div>

            {/* Input Area */}
            {!stats.gameCompleted && (
              <div className="px-4">
                {coins === 0 && (
                  <div className="mb-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm">Out of coins! Game over.</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chat.question}
                    onChange={(e) => chat.setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a yes/no question about the story..."
                    disabled={chat.isSubmitting || coins === 0}
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={chat.submitQuestion}
                    disabled={!chat.question.trim() || chat.isSubmitting || coins === 0}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {chat.isSubmitting ? 'Asking...' : 'Ask'}
                  </button>
                </div>

                {chat.error && (
                  <div className="mt-2 p-2 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm">
                    {chat.error}
                  </div>
                )}
              </div>
            )}

            {/* Chat History */}
            <div className="px-4 py-2">
              <div className="p-6 max-h-48 overflow-y-auto">
                {chat.affirmations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Ask questions to discover the story! Each question costs 1 coin.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Example: "The man is carrying something" or "he is carrying a bag"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chat.affirmations.map((affirmation, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "flex-1 rounded-lg p-3 flex justify-between items-center",
                          {
                            'bg-green-900/20 text-green-300': affirmation.answer === 'Yes',
                            'bg-red-900/20 text-red-300': affirmation.answer === 'No',
                            'bg-yellow-900/20 text-yellow-300': affirmation.answer === 'Irrelevant'
                          }
                        )}
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-sm truncate">{affirmation.affirmation}</p>
                          {affirmation.explanation && (
                            <p className="text-xs opacity-75 mt-1">{affirmation.explanation}</p>
                          )}
                        </div>
                        <span className="text-xs font-medium flex-shrink-0">{affirmation.answer}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - will add later */}
        <div className="lg:col-span-1 lg:pl-4">
          {/* This will be for hints, achievements, etc. */}
        </div>
      </div>
    </div>
  )
}