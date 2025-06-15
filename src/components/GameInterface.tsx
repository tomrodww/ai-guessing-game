'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { StoryWithDetails, AffirmationHistory, AffirmationResponse } from '@/types'
import { getThemeColors, formatDuration, cn } from '@/lib/utils'
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  Sparkles,
  Trophy,
  RotateCcw,
  Lightbulb,
  Target,
  BookOpen,
  Check,
  X,
  AlertCircle,
  Eye,
  Rocket,
  Brain
} from 'lucide-react'

interface GameInterfaceProps {
  story: StoryWithDetails
}

interface PlayerAffirmation {
  affirmation: string
  answer: 'Yes' | 'No' | 'Irrelevant'
  timestamp: Date
  explanation?: string
  phraseId?: string
  isUsed?: boolean
}

// Custom icon component that handles the map.svg for adventure themes
const getThemeIcon = (iconName: string) => {
  switch (iconName) {
    case 'Eye':
      return Eye
    case 'Rocket':
      return Rocket
    case 'Map':
      return () => <Image src="/map.svg" alt="Adventure" width={20} height={20} />
    default:
      return Eye
  }
}

// Calculate difficulty name based on phrase count
const getDifficultyName = (count: number) => {
  if (count === 3) return 'Watson'
  if (count === 5) return 'Holmes'
  return 'Moriarty'
}

export function GameInterface({ story }: GameInterfaceProps) {
  const [affirmations, setAffirmations] = useState<AffirmationHistory[]>([])
  const [yesAffirmations, setYesAffirmations] = useState<PlayerAffirmation[]>([])
  const [currentAffirmation, setCurrentAffirmation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameStartTime] = useState(new Date())
  const [gameCompleted, setGameCompleted] = useState(false)
  const [discoveredPhrases, setDiscoveredPhrases] = useState<string[]>([])
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const totalPhrases = story.phrases.length
  const IconComponent = getThemeIcon(story.theme.icon)
  const colors = getThemeColors(story.theme.color)
  const difficultyName = getDifficultyName(totalPhrases)
  const progress = Math.round((discoveredPhrases.length / totalPhrases) * 100)

  // Auto-scroll to top when new messages are added (since newest is now at top)
  useEffect(() => {
    if (affirmations.length > 0) {
      const chatContainer = chatEndRef.current?.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = 0
      }
    }
  }, [affirmations])

  // Focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submitAffirmation = async () => {
    if (!currentAffirmation.trim() || isSubmitting) return

    setIsSubmitting(true)
    const affirmationText = currentAffirmation.trim()
    setCurrentAffirmation('')

    try {
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affirmation: affirmationText,
          storyId: story.id,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const data: AffirmationResponse = result.data

        // Add affirmation to history
        const newAffirmation: AffirmationHistory = {
          affirmation: affirmationText,
          answer: data.answer,
          timestamp: new Date(),
          explanation: data.explanation,
          phraseId: data.phraseDiscovered?.id,
        }

        setAffirmations(prev => [...prev, newAffirmation])

        // Save "Yes" affirmations for the clues panel
        if (data.answer === 'Yes') {
          const newYesAffirmation: PlayerAffirmation = {
            affirmation: affirmationText,
            answer: data.answer,
            timestamp: new Date(),
            explanation: data.explanation,
            phraseId: data.phraseDiscovered?.id,
            isUsed: false
          }
          setYesAffirmations(prev => [...prev, newYesAffirmation])
        }

        // Handle phrase discovery
        if (data.phraseDiscovered) {
          setDiscoveredPhrases(prev => [...prev, data.phraseDiscovered!.id])
          
          // Mark related affirmations as used
          setYesAffirmations(prev => 
            prev.map(aff => 
              aff.phraseId === data.phraseDiscovered!.id 
                ? { ...aff, isUsed: true }
                : aff
            )
          )
        }

        // Handle story completion
        if (data.storyCompleted) {
          setGameCompleted(true)
        }

      } else {
        // Handle error
        const errorAffirmation: AffirmationHistory = {
          affirmation: affirmationText,
          answer: 'Irrelevant',
          timestamp: new Date(),
          explanation: result.error || 'Something went wrong. Please try again.',
        }
        setAffirmations(prev => [...prev, errorAffirmation])
      }

    } catch (error) {
      console.error('Error submitting affirmation:', error)
      const errorAffirmation: AffirmationHistory = {
        affirmation: affirmationText,
        answer: 'Irrelevant',
        timestamp: new Date(),
        explanation: 'Network error. Please check your connection and try again.',
      }
      setAffirmations(prev => [...prev, errorAffirmation])
    } finally {
      setIsSubmitting(false)
      // Add a small delay to ensure focus sticks after rendering updates
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // 100ms delay should be enough
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitAffirmation()
    }
  }

  const resetGame = () => {
    setAffirmations([])
    setYesAffirmations([])
    setDiscoveredPhrases([])
    setGameCompleted(false)
    setCurrentAffirmation('')
    inputRef.current?.focus()
  }

  const getAnswerIcon = (answer: string) => {
    switch (answer) {
      case 'Yes':
        return <Check className="w-4 h-4 text-green-600" />
      case 'No':
        return <X className="w-4 h-4 text-red-600" />
      case 'Irrelevant':
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'Yes':
        return 'bg-green-900/20 border-green-700 text-green-300'
      case 'No':
        return 'bg-red-900/20 border-red-700 text-red-300'
      case 'Irrelevant':
        return 'bg-muted border-border text-muted-foreground'
      default:
        return 'bg-muted border-border text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="mt-1">Back</span>
              </Link>
              
              <div className="h-6 w-px bg-border" />
              
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground text-xl mt-1">{story.title}<span className="text-sm text-muted-foreground"> • {difficultyName}</span></h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>{discoveredPhrases.length}/{totalPhrases}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(gameStartTime, gameCompleted ? new Date() : undefined)}</span>
              </div>

              {gameCompleted && (
                <button
                  onClick={resetGame}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    colors.bg, colors.text, "hover:opacity-80"
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="mt-1">Play Again</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            {/* Story Context */}
            <div className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 h-8">
                  <BookOpen className="w-6 h-6 text-blue-800" />
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
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>

            {/* Story Reveal */}
            <div className="">
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-foreground mt-1">Story</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                                    <div className="prose prose-sm max-w-none">
                    <div className="leading-relaxed text-foreground">
                      {(() => {
                        const sortedPhrases = [...story.phrases].sort((a, b) => a.order - b.order)
                        
                        return (
                          <div className="space-y-1">
                            {sortedPhrases.map((phrase) => {
                              const isDiscovered = discoveredPhrases.includes(phrase.id)
                              
                              if (isDiscovered) {
                                return (
                                  <span 
                                    key={phrase.id}
                                    className="text-green-200 px-1 py-0.5 rounded font-medium inline-block mr-1"
                                  >
                                    {phrase.text}
                                  </span>
                                )
                              } else {
                                return (
                                  <span 
                                    key={phrase.id}
                                    className="blur-sm text-muted-foreground select-none inline-block mr-1"
                                  >
                                    {phrase.text}
                                  </span>
                                )
                              }
                            })}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Make Your statement</h3>
              </div>

              {/* Input Area */}
              {!gameCompleted && (
                <div className="p-4 border-t border-border">
                  <div className="flex space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentAffirmation}
                      onChange={(e) => setCurrentAffirmation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Make an affirmation about the story..."
                      className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent pt-3"
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={submitAffirmation}
                      disabled={!currentAffirmation.trim() || isSubmitting}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-center align-center",
                        currentAffirmation.trim() && !isSubmitting
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <span className="text-bottom self-center h-4 mt-1">{isSubmitting ? 'Thinking...' : 'Send'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6 max-h-96 overflow-y-auto">
                {affirmations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Make your statement</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Example: "The man is carrying something" or "he is carrying a bag"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...affirmations].reverse().map((aff, index) => (
                      <div key={affirmations.length - 1 - index} className="flex space-x-3 mb-3">
                        <div className={cn(
                          "flex-1 rounded-lg p-3 flex justify-between items-center",
                          aff.answer === 'Yes' 
                            ? "bg-green-900/20 text-green-300" 
                            : aff.answer === 'No'
                            ? "bg-red-900/20 text-red-300"
                            : "bg-gray-800 text-gray-400"
                        )}>
                          <p className="text-sm">{aff.affirmation}</p>
                          <span className="text-xs font-medium ml-3">{aff.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

            </div>

            {/* Completion Message */}
            {gameCompleted && (
              <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-300">Congratulations!</h3>
                    <p className="text-green-400">
                      You've discovered all the phrases in the story! You completed it in{' '}
                      {formatDuration(gameStartTime, new Date())} with {affirmations.length} affirmations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Your Clues */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-foreground mt-1">Your Clues</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Statements that got "Yes" responses
                </p>
              </div>
              
              <div className="p-6">
                {yesAffirmations.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No clues yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Make correct affirmations to collect clues!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {yesAffirmations.map((clue, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "p-3 rounded-lg border transition-colors",
                          clue.isUsed 
                            ? "bg-muted border-border text-muted-foreground" 
                            : "bg-green-900/20 border-green-700 text-green-300"
                        )}
                      >
                        <div className="flex items-start space-x-2">
                          <CheckCircle className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            clue.isUsed ? "text-muted-foreground" : "text-green-400"
                          )} />
                          <p className="text-sm">{clue.affirmation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Story Hints */}
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-foreground mt-1">Hints</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Subtle clues to guide your thinking. If you need.
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {story.hints.map((hint, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-xs font-medium text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded-full">
                          {index + 1}
                        </span>
                        <p className="text-sm text-yellow-300 flex-1">{hint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}