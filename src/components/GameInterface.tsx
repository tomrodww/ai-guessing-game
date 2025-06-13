'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { StoryWithDetails, AffirmationHistory, AffirmationResponse } from '@/types'
import { getThemeColors, formatDuration, cn } from '@/lib/utils'
import { 
  ArrowLeft, 
  Send, 
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
  AlertCircle
} from 'lucide-react'
import * as Icons from 'lucide-react'

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
  const IconComponent = Icons[story.theme.icon as keyof typeof Icons] as any
  const colors = getThemeColors(story.theme.color)
  const progress = Math.round((discoveredPhrases.length / totalPhrases) * 100)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      inputRef.current?.focus()
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
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      default:
        return null
    }
  }

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'Yes':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'No':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'Irrelevant':
        return 'bg-gray-50 border-gray-200 text-gray-600'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm",
        `border-${colors.primary}-200`
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className={cn(
                  "flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors",
                  `hover:text-${colors.primary}-600`
                )}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Stories</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  `bg-${colors.primary}-100`
                )}>
                  <IconComponent className={cn("w-5 h-5", `text-${colors.primary}-600`)} />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">{story.title}</h1>
                  <p className="text-sm text-gray-500">{story.theme.name} • {story.difficulty}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>{discoveredPhrases.length}/{totalPhrases} phrases</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(gameStartTime, gameCompleted ? new Date() : undefined)}</span>
              </div>

              {gameCompleted && (
                <button
                  onClick={resetGame}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    `bg-${colors.primary}-100 text-${colors.primary}-700 hover:bg-${colors.primary}-200`
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Context */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "p-3 rounded-lg flex-shrink-0",
                  `bg-${colors.primary}-100`
                )}>
                  <BookOpen className={cn("w-6 h-6", `text-${colors.primary}-600`)} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Story Context</h2>
                  <p className="text-gray-700 leading-relaxed">{story.context}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <span className="text-sm text-gray-600">{progress}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn("h-2 rounded-full transition-all duration-500", `bg-${colors.primary}-500`)}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{discoveredPhrases.length}</div>
                  <div className="text-sm text-gray-600">Phrases Discovered</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{affirmations.length}</div>
                  <div className="text-sm text-gray-600">Affirmations Made</div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Make Your Affirmations</h3>
                <p className="text-sm text-gray-600 mt-1">
                  State what you think happened in the story. Get "Yes" for correct statements!
                </p>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                {affirmations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Make your first affirmation to start discovering the story!</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Example: "The man was very short" or "He used an umbrella"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {affirmations.map((aff, index) => (
                      <div key={index} className="flex space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">You</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-blue-50 rounded-lg p-3 mb-2">
                            <p className="text-gray-900">{aff.affirmation}</p>
                          </div>
                          <div className={cn(
                            "rounded-lg p-3 border",
                            getAnswerColor(aff.answer)
                          )}>
                            <div className="flex items-center space-x-2 mb-1">
                              {getAnswerIcon(aff.answer)}
                              <span className="font-medium">{aff.answer}</span>
                            </div>
                            {aff.explanation && (
                              <p className="text-sm mt-1">{aff.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              {!gameCompleted && (
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentAffirmation}
                      onChange={(e) => setCurrentAffirmation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Make an affirmation about the story..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                    <button
                      onClick={submitAffirmation}
                      disabled={!currentAffirmation.trim() || isSubmitting}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2",
                        currentAffirmation.trim() && !isSubmitting
                          ? `bg-${colors.primary}-600 text-white hover:bg-${colors.primary}-700`
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Completion Message */}
            {gameCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Congratulations!</h3>
                    <p className="text-green-700">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Lightbulb className={cn("w-5 h-5", `text-${colors.primary}-600`)} />
                  <h3 className="text-lg font-semibold text-gray-900">Your Clues</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Statements that got "Yes" responses
                </p>
              </div>
              
              <div className="p-6">
                {yesAffirmations.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No clues yet</p>
                    <p className="text-sm text-gray-500 mt-1">
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
                            ? "bg-gray-100 border-gray-300 text-gray-500" 
                            : "bg-green-50 border-green-200 text-green-800"
                        )}
                      >
                        <div className="flex items-start space-x-2">
                          <CheckCircle className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            clue.isUsed ? "text-gray-400" : "text-green-600"
                          )} />
                          <p className="text-sm">{clue.affirmation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Discovered Phrases */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Target className={cn("w-5 h-5", `text-${colors.primary}-600`)} />
                  <h3 className="text-lg font-semibold text-gray-900">Discovered Phrases</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  The story phrases you've uncovered
                </p>
              </div>
              
              <div className="p-6">
                {discoveredPhrases.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No phrases discovered yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Keep making affirmations to reveal the story!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {story.phrases
                      .filter(phrase => discoveredPhrases.includes(phrase.id))
                      .sort((a, b) => a.order - b.order)
                      .map((phrase) => (
                        <div 
                          key={phrase.id}
                          className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {phrase.order}
                            </span>
                            <p className="text-sm text-blue-800 flex-1">{phrase.text}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Story Hints */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Lightbulb className={cn("w-5 h-5", `text-${colors.primary}-600`)} />
                  <h3 className="text-lg font-semibold text-gray-900">Story Hints</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Subtle clues to guide your thinking
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {story.hints.map((hint, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                          {index + 1}
                        </span>
                        <p className="text-sm text-yellow-800 flex-1">{hint}</p>
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