'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StoryWithDetails, QuestionHistory, QuestionResponse } from '@/types'
import { formatDuration, formatCountdown, cn } from '@/lib/utils'
import { 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle, 
  Clock, 
  MessageCircle,
  Sparkles,
  Trophy,
  RotateCcw,
  Lightbulb,
  Target,
  BookOpen,
  Eye,
  Rocket,
  Coins,
  ShieldQuestionIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'



interface GameInterfaceProps {
  story: StoryWithDetails
}

interface PlayerQuestion {
  question: string
  answer: 'Yes' | 'No' | 'Irrelevant'
  timestamp: Date
  explanation?: string
  phraseId?: string
}

interface StoryNavigation {
  previous: {
    id: string
    title: string
    themeName: string
  } | null
  next: {
    id: string
    title: string
    themeName: string
  } | null
  current: {
    index: number
    total: number
  }
}

// Theme to icon mapping
const getThemeIcon = (theme: string) => {
  switch (theme) {
    case 'Mystery':
      return Eye
    case 'Sci-Fi':
      return Rocket
    case 'Adventure':
      return () => <Image src="/map.svg" alt="Adventure" width={20} height={20} />
    default:
      return Eye
  }
}

// Theme to color mapping
const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'Mystery':
      return 'purple'
    case 'Sci-Fi':
      return 'blue'
    case 'Adventure':
      return 'green'
    default:
      return 'purple'
  }
}

// Note: getDifficultyName is now imported from @/lib/difficulty

export function GameInterface({ story }: GameInterfaceProps) {
  const [questions, setQuestions] = useState<QuestionHistory[]>([])
  const [yesQuestions, setYesQuestions] = useState<PlayerQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(new Date())
  const [gameCompleted, setGameCompleted] = useState(false)
  const [discoveredPhrases, setDiscoveredPhrases] = useState<string[]>([])
  const [revealedPhraseTexts, setRevealedPhraseTexts] = useState<Record<string, string>>({}) // Maps phrase ID to actual text
  const [coins, setCoins] = useState(7) // Starting coins
  const [hintsUnlocked, setHintsUnlocked] = useState<number[]>([]) // Unlocked hint indices
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date()) // For real-time timer
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [navigation, setNavigation] = useState<StoryNavigation | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  
  // Gamification animations state
  const [coinChange, setCoinChange] = useState<{value: number, id: number} | null>(null)
  const [phraseAnimation, setPhraseAnimation] = useState<{show: boolean, id: number} | null>(null)
  const [timeWarning, setTimeWarning] = useState<{message: string, id: number} | null>(null)
  const [timeWarnings, setTimeWarnings] = useState<{[key: string]: boolean}>({
    '15min': false,
    '10min': false,
    '5min': false,
    '1min': false
  })
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const totalPhrases = story.phrases.length
  
  // Animation helper functions
  const triggerCoinAnimation = (change: number) => {
    const id = Date.now()
    setCoinChange({ value: change, id })
    setTimeout(() => setCoinChange(null), 2000) // Animation duration
  }
  
  const triggerPhraseAnimation = () => {
    const id = Date.now()
    setPhraseAnimation({ show: true, id })
    setTimeout(() => setPhraseAnimation(null), 1500) // Animation duration
  }
  
  const triggerTimeWarning = (message: string) => {
    console.log('triggerTimeWarning called with:', message)
    const id = Date.now()
    setTimeWarning({ message, id })
    setTimeout(() => setTimeWarning(null), 3000) // Longer duration for warnings
  }
  
  // Timer helper functions
  const getElapsedMinutes = () => {
    const diff = (gameCompleted ? new Date() : currentTime).getTime() - gameStartTime.getTime()
    return Math.floor(diff / 60000)
  }
  
  const getElapsedSeconds = () => {
    const diff = (gameCompleted ? new Date() : currentTime).getTime() - gameStartTime.getTime()
    return Math.floor(diff / 1000)
  }
  
  const getRemainingSeconds = () => {
    const totalGameSeconds = 20 * 60 // 20 minutes in seconds
    return Math.max(0, totalGameSeconds - getElapsedSeconds())
  }
  
  const isTimeExpired = () => getElapsedMinutes() >= 20
  const getTimeRemaining = () => Math.max(0, 20 - getElapsedMinutes())
  const isLastFiveMinutes = () => getTimeRemaining() <= 5
  const progress = Math.min(100, Math.round((discoveredPhrases.length / totalPhrases) * 100))
  
  // Calculate word count for validation
  const wordCount = currentQuestion.trim().split(/\s+/).filter(word => word.length > 0).length
  const isValidQuestion = currentQuestion.trim() && !isSubmitting && currentQuestion.length <= 50 && wordCount >= 3 && coins >= 1

  // Auto-scroll to top when new messages are added (since newest is now at top)
  useEffect(() => {
    if (questions.length > 0) {
      const chatContainer = chatEndRef.current?.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = 0
      }
    }
  }, [questions])

  // Initialize game session - create a new session on every page load
  useEffect(() => {
    const startSession = async () => {
      try {
        // Always create a fresh session (no session reuse)
        const response = await fetch('/api/game-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'start',
            storyId: story.id,
            forceNew: true, // Force creation of new session
          }),
        })

        const result = await response.json()
        if (result.success) {
          setSessionId(result.data.sessionId)
          setCoins(result.data.coins)
          setHintsUnlocked(result.data.hintsUnlocked)
        }

        // Focus input
        inputRef.current?.focus()
      } catch (error) {
        console.error('Error starting game session:', error)
      }
    }

    startSession()
  }, [story.id])

  // Real-time timer update with warnings
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameCompleted && !isTimeExpired()) {
        const now = new Date()
        setCurrentTime(now)
        
        // Check for time warnings - calculate elapsed time directly
        const elapsedMs = now.getTime() - gameStartTime.getTime()
        const elapsed = Math.floor(elapsedMs / 60000) // minutes
        const elapsedSeconds = Math.floor(elapsedMs / 1000) // seconds
        const timeRemaining = Math.max(0, 20 - elapsed)
                  
        // Warnings based on time remaining
        if (timeRemaining <= 15 && timeRemaining > 14 && !timeWarnings['15min']) {
          console.log('Triggering 15 minutes left warning (test)')
          setTimeWarnings(prev => ({ ...prev, '15min': true }))
          triggerTimeWarning('⚠️ 15 minutes left! (test)')
        }
        if (timeRemaining <= 10 && timeRemaining > 9 && !timeWarnings['10min']) {
          console.log('Triggering 10 minutes left warning')
          setTimeWarnings(prev => ({ ...prev, '10min': true }))
          triggerTimeWarning('⚠️ 10 minutes left!')
        }
        if (timeRemaining <= 5 && timeRemaining > 4 && !timeWarnings['5min']) {
          console.log('Triggering 5 minutes left warning')
          setTimeWarnings(prev => ({ ...prev, '5min': true }))
          triggerTimeWarning('🚨 5 minutes left!')
        }
        if (timeRemaining <= 1 && timeRemaining > 0 && !timeWarnings['1min']) {
          console.log('Triggering 1 minute left warning')
          setTimeWarnings(prev => ({ ...prev, '1min': true }))
          triggerTimeWarning('🚨 1 minute left!')
        }
        
        // End game if time expired
        if (elapsed >= 20) {
          setGameCompleted(true)
        }
      }
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [gameCompleted, timeWarnings, gameStartTime])

  // Fetch navigation data
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch(`/api/story-navigation?storyId=${story.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setNavigation(result.data)
          }
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error)
      }
    }

    fetchNavigation()
  }, [story.id])

  // Fetch revealed phrases when session is available
  useEffect(() => {
    const fetchRevealedPhrases = async () => {
      if (!sessionId) return

      try {
        const response = await fetch(`/api/revealed-phrases?sessionId=${sessionId}&storyId=${story.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            const revealedTexts: Record<string, string> = {}
            result.data.revealedPhrases.forEach((phrase: any) => {
              revealedTexts[phrase.id] = phrase.text
              if (!discoveredPhrases.includes(phrase.id)) {
                setDiscoveredPhrases(prev => [...prev, phrase.id])
              }
            })
            setRevealedPhraseTexts(revealedTexts)
          }
        }
      } catch (error) {
        console.error('Error fetching revealed phrases:', error)
      }

      const chatContainer = chatEndRef.current?.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = 0
      }
    }

    fetchRevealedPhrases()
  }, [sessionId, story.id, ])

  const submitQuestion = async () => {
    if (!currentQuestion.trim() || isSubmitting) return

    // Check character limit before sending
    if (currentQuestion.length > 50) {
      const errorQuestion: QuestionHistory = {
        question: currentQuestion,
        answer: 'Irrelevant',
        timestamp: new Date(),
        explanation: `Question too long! Please keep it under 50 characters. (Current: ${currentQuestion.length})`,
      }
      setQuestions(prev => [...prev, errorQuestion])
      setCurrentQuestion('')
      return
    }

    // Check minimum word count before sending
    if (wordCount < 3) {
      const errorQuestion: QuestionHistory = {
        question: currentQuestion,
        answer: 'Irrelevant',
        timestamp: new Date(),
        explanation: `Please use at least 3 words in your question. (Current: ${wordCount} word${wordCount !== 1 ? 's' : ''})`,
      }
      setQuestions(prev => [...prev, errorQuestion])
      setCurrentQuestion('')
      return
    }

    // Check if player has enough coins to ask a question
    if (coins < 1) {
      const errorQuestion: QuestionHistory = {
        question: currentQuestion,
        answer: 'Irrelevant',
        timestamp: new Date(),
        explanation: 'You need at least 1 coin to ask a question. Reveal phrases to earn more coins!',
      }
      setQuestions(prev => [...prev, errorQuestion])
      setCurrentQuestion('')
      return
    }

    setIsSubmitting(true)
    const questionText = currentQuestion.trim()
    setCurrentQuestion('')

    try {
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          storyId: story.id,
          sessionId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const data: QuestionResponse = result.data

        // Deduct 1 coin for asking a question
        setCoins(prev => prev - 1)
        triggerCoinAnimation(-1)

        // Add question to history
        const newQuestion: QuestionHistory = {
          question: questionText,
          answer: data.answer,
          timestamp: new Date(),
          explanation: data.explanation,
          phraseId: data.phraseDiscovered?.id,
        }

        setQuestions(prev => [...prev, newQuestion])

        // Save "Yes" questions for the clues panel
        if (data.answer === 'Yes') {
          const newYesQuestion: PlayerQuestion = {
            question: questionText,
            answer: data.answer,
            timestamp: new Date(),
            explanation: data.explanation,
            phraseId: data.phraseDiscovered?.id,
          }
          setYesQuestions(prev => [...prev, newYesQuestion])
        }

        // Handle phrase discovery
        if (data.phraseDiscovered) {
          setDiscoveredPhrases(prev => [...prev, data.phraseDiscovered!.id])
          triggerPhraseAnimation()
          
          // Store the actual revealed phrase text securely
          setRevealedPhraseTexts(prev => ({
            ...prev,
            [data.phraseDiscovered!.id]: data.phraseDiscovered!.text
          }))
          
          // Add coins for revealing a phrase (3 coins per phrase)
          if (data.coinsEarned) {
            setCoins(prev => prev + data.coinsEarned!)
            triggerCoinAnimation(data.coinsEarned)
          }
        }

        // Handle story completion
        if (data.storyCompleted) {
          setGameCompleted(true)
          setShowCompletionDialog(true)
        }

      } else {
        // Handle error
        const errorQuestion: QuestionHistory = {
          question: questionText,
          answer: 'Irrelevant',
          timestamp: new Date(),
          explanation: result.error || 'Something went wrong. Please try again.',
        }
        setQuestions(prev => [...prev, errorQuestion])
      }

    } catch (error) {
      console.error('Error submitting question:', error)
      const errorQuestion: QuestionHistory = {
        question: questionText,
        answer: 'Irrelevant',
        timestamp: new Date(),
        explanation: 'Network error. Please check your connection and try again.',
      }
      setQuestions(prev => [...prev, errorQuestion])
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
      submitQuestion()
    }
  }

  const resetGame = () => {
    setQuestions([])
    setYesQuestions([])
    setDiscoveredPhrases([])
    setRevealedPhraseTexts({}) // Clear revealed phrase texts
    setGameCompleted(false)
    setCurrentQuestion('')
    setCoins(7) // Reset to starting coins
    setHintsUnlocked([]) // Reset unlocked hints
    setShowCompletionDialog(false) // Close dialog if open
    setCoinChange(null) // Reset animations
    setPhraseAnimation(null)
    setTimeWarning(null)
    setTimeWarnings({ '15min': false, '10min': false, '5min': false, '1min': false })
    inputRef.current?.focus()
    setGameStartTime(new Date())
  }

  const unlockHint = async (hintIndex: number) => {
    const cost = hintIndex + 1 // 1 coin for first hint, 2 for second, 3 for third
    if (coins >= cost && !hintsUnlocked.includes(hintIndex) && sessionId) {
      try {
        console.log('Attempting to unlock hint:', { hintIndex, cost, sessionId, coins })
        
        const response = await fetch('/api/game-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'unlock-hint',
            sessionId,
            hintIndex,
          }),
        })

        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)

        if (!response.ok) {
          console.error('Response not ok:', response.status, response.statusText)
          return
        }

        const result = await response.json()
        console.log('Unlock hint result:', result)
        
        if (result.success) {
          const costPaid = cost
          setCoins(result.data.coins)
          setHintsUnlocked(result.data.hintsUnlocked)
          triggerCoinAnimation(-costPaid)
        } else {
          console.error('Failed to unlock hint:', result.error)
        }
      } catch (error) {
        console.error('Error unlocking hint:', error)
      }
    } else {
      console.log('Cannot unlock hint:', { 
        hasEnoughCoins: coins >= cost, 
        notAlreadyUnlocked: !hintsUnlocked.includes(hintIndex),
        hasSessionId: !!sessionId,
        coins,
        cost,
        hintIndex,
        hintsUnlocked
      })
    }
  }

  // Navigation handlers
  const handleNavigation = async (storyId: string) => {
    setIsNavigating(true)
    router.push(`/story/${storyId}`)
  }

  return (
    <div className="container mx-auto min-h-screen bg-background w-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 h-full">

        {/* Navigation buttons */}
        <div className="flex justify-between items-center w-full h-8">
          {/* Left column - Previous */}
          <div className="flex overflow-hidden">
            {navigation?.previous ? (
              <button
                onClick={() => navigation.previous && handleNavigation(navigation.previous.id)}
                disabled={isNavigating}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
                title={`Previous: ${navigation.previous.title}`}
              >
                <ChevronLeft className={`w-4 h-4 flex-shrink-0 ${isNavigating ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline truncate mt-1">{navigation.previous.title}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground/50">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </div>
            )}
          </div>

          {/* Right column - Next */}
          <div className="flex overflow-hidden h-8">
            {navigation?.next ? (
              <button
                onClick={() => navigation.next && handleNavigation(navigation.next.id)}
                disabled={isNavigating}
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0",
                  isNavigating ? "animate-pulse" : ""
                )}
                title={`Next: ${navigation.next.title}`}
              >
                <span className="hidden sm:inline truncate mt-1">{navigation.next.title}</span>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isNavigating ? 'animate-pulse' : ''}`} />
              </button>
            ) : (
              <div className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground/50">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
        
        {/* Game Area */}    
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-border">
          
          {/* Main Game Area */}
          <div className="lg:col-span-2 lg:pr-4 ">
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
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">{progress}%</span>
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
                      {(() => {
                        const sortedPhrases = [...story.phrases].sort((a, b) => a.order - b.order)
                        
                        return (
                          <div className="space-y-1">
                            {sortedPhrases.map((phrase) => {
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
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground">Ask Your Question</h3>
              </div>

              {/* Input Area */}
              {!gameCompleted && !isTimeExpired() && (
                <div className="px-4">
                  {coins === 0 && (
                    <div className="mb-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4" />
                        <p className="text-sm text-red-300">
                          Out of coins! Refresh the page to start a new game.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={currentQuestion + '?'}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Remove ALL question marks that the user types - only the app adds them
                          const cleanValue = value.replace(/\?/g, '');
                          setCurrentQuestion(cleanValue);
                        }}
                        onKeyDown={(e) => {
                          // Prevent cursor from going after the question mark
                          const input = e.target as HTMLInputElement;
                          const cursorPosition = input.selectionStart ?? 0;
                          const questionMarkIndex = input.value.length; // The question mark is always at the end
                          
                          if (cursorPosition > questionMarkIndex - 1) {
                            // Move cursor to just before the question mark
                            setTimeout(() => {
                              input.setSelectionRange(questionMarkIndex - 1, questionMarkIndex - 1);
                            }, 0);
                          }
                        }}
                        onClick={(e) => {
                          // Ensure cursor is positioned before the question mark when clicking
                          const input = e.target as HTMLInputElement;
                          const questionMarkIndex = input.value.length; // The question mark is always at the end
                          setTimeout(() => {
                            input.setSelectionRange(questionMarkIndex - 1, questionMarkIndex - 1);
                          }, 0);
                        }}
                        onPaste={(e) => {
                          // Prevent pasting text with question marks
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text').replace(/\?/g, '');
                          const newValue = currentQuestion + pastedText;
                          if (newValue.length <= 50) {
                            setCurrentQuestion(newValue);
                          }
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about the story (at least 3 words)..."
                        className="w-full pl-4 pr-8 pt-4 border-b-2 border-border bg-background text-lg max-lg:text-md text-foreground focus:outline-none"
                        disabled={isSubmitting}
                        maxLength={51}
                      />
                      <div className={cn(
                        "absolute right-3 top-3 text-xs",
                        currentQuestion.length >= 50 
                          ? "text-red-400 font-medium" 
                          : "text-muted-foreground"
                      )}>
                        {50 - currentQuestion.length}
                      </div>
                      <div className={cn(
                        "text-xs p-2",
                        wordCount < 3
                          ? "text-red-400 font-medium" 
                          : "text-muted-foreground"
                      )}>
                        {wordCount}/3 word{wordCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <button
                      onClick={submitQuestion}
                      disabled={!isValidQuestion}
                      className={cn(
                        " h-10 w-32 rounded-lg font-medium transition-colors flex items-center justify-center text-center align-center",
                        isValidQuestion
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <span className="text-bottom self-center h-4 mt-1">
                        {isSubmitting ? 'Thinking...' : coins < 1 ? 'No Coins' : 'Send'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6 max-h-48 overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Ask a question</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Example: "Is the man carrying something?" or "Is he carrying a bag?"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...questions].reverse().map((q, index) => (
                      <div key={questions.length - 1 - index} className="flex space-x-3 mb-3">
                        <div className={cn(
                          "flex-1 rounded-lg p-3 flex justify-between items-center",
                          q.answer === 'Yes' 
                            ? "bg-green-900/20 text-green-300" 
                            : q.answer === 'No'
                            ? "bg-gray-800 text-gray-400"
                            : "bg-gray-800 text-gray-400"
                        )}>
                          <p className="text-sm">{q.question}</p>
                          <span className="text-xs font-medium ml-3">{q.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

            </div>

            {/* Completion Dialog */}
            {showCompletionDialog && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="relative bg-background border border-border rounded-xl p-6 max-w-md w-full">
                  <button
                    onClick={() => setShowCompletionDialog(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 justify-center w-full">
                      <Trophy className="w-8 h-8 text-green-400" />
                      <h3 className="text-xl font-medium text-green-400 mt-2">Congratulations!</h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 px-2 text-center">
                    You've discovered all the phrases in the story! You completed it in{' '}
                    {formatDuration(gameStartTime, new Date())} with {questions.length} questions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {navigation?.next ? (
                      <button
                        onClick={() => navigation.next && handleNavigation(navigation.next.id)}
                        disabled={isNavigating}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isNavigating ? 'Loading...' : `Next: ${navigation.next?.title || ''}`}
                      </button>
                    ) : (
                      <Link
                        href="/"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                      >
                        Back to Stories
                      </Link>
                    )}
                    <button
                      onClick={() => setShowCompletionDialog(false)}
                      className="flex-1 bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar*/}
          <div className="space-y-4 lg:pl-4">
            {/* Game stats Panel */}
            <div className="p-2 space-y-2 text-sm rounded-lg bg-gray-900 ">
              <div className="flex items-center max-md:text-xs text-sm justify-around">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground relative px-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 font-medium mt-1">{coins}</span>
                  {coinChange && (
                    <span 
                      key={coinChange.id}
                      className={`absolute left-8 text-lg font-bold text-center ${
                        coinChange.value > 0 ? 'text-green-400 -top-2' : 'text-red-400 top-6'
                      } transition-all duration-2000`}
                      style={{
                        animation: coinChange.value > 0 ? 'fadeUpOut 2s ease-out forwards' : 'fadeDownOut 2s ease-out forwards'
                      }}
                    >
                      {coinChange.value > 0 ? '+' : ''}{coinChange.value}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground relative px-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="mt-1">{discoveredPhrases.length}/{totalPhrases}</span>
                  {phraseAnimation && (
                    <span 
                      key={phraseAnimation.id}
                      className="absolute -top-1 -right-1 text-green-400 animate-ping"
                      style={{
                        animation: 'ping 1.5s ease-out'
                      }}
                    >
                      ✨
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground relative px-2 justify-center">
                  <Clock className={`w-4 h-4 ${isLastFiveMinutes() ? 'text-red-500' : 'text-blue-500'}`} />
                  <span className={`mt-1 w-10 ${isLastFiveMinutes() ? 'text-red-400 font-bold' : ''}`}>
                    {isTimeExpired() ? '00:00' : formatCountdown(getRemainingSeconds())}
                  </span>
                  {timeWarning && (
                    <span 
                      key={timeWarning.id}
                      className="absolute top-6 left-0 text-orange-400 text-xs font-bold transition-all duration-3000 whitespace-nowrap z-10"
                      style={{
                        animation: 'fadeDownOut 3s ease-out forwards'
                      }}
                    >
                      {timeWarning.message}
                    </span>
                  )}
                </div>

                {gameCompleted && (
                  <button
                    onClick={resetGame}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      "hover:opacity-80"
                    )}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="mt-1">Play Again</span>
                  </button>
                )}
              </div>
              
              {/* Time warnings */}
              {!gameCompleted && getTimeRemaining() <= 5 && getTimeRemaining() > 0 && (
                <div className="text-center py-2">
                  <p className="text-red-400 text-sm font-bold animate-pulse">
                    ⚠️ Only {getTimeRemaining()} minutes left!
                  </p>
                </div>
              )}
              
              {isTimeExpired() && (
                <div className="text-center py-2">
                  <p className="text-red-500 text-sm font-bold">
                    ⏰ Time's up! Game over.
                  </p>
                </div>
              )}
            </div>

            {/* Economy Panel */}
            <div className="p-2 space-y-2 text-sm border-b border-border">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-lg font-semibold text-foreground mt-1">Economy</span>
              </div>
              
              <div className="px-2 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Each Question</span>
                  </div>
                  <span className="flex gap-1 text-red-400 font-medium">-1<Coins className="w-3 h-3 text-yellow-500" /></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Phrase Revealed</span>
                  </div>
                  <span className="flex gap-1 text-green-400 font-medium">+3<Coins className="w-3 h-3 text-yellow-500" /></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Hint 1</span>
                  </div>
                  <span className="flex gap-1 text-red-400 font-medium">-1<Coins className="w-3 h-3 text-yellow-500" /></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Hint 2</span>
                  </div>
                  <span className="flex gap-1 text-red-400 font-medium">-2<Coins className="w-3 h-3 text-yellow-500" /></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Hint 3</span>
                  </div>
                  <span className="flex gap-1 text-red-400 font-medium">-3<Coins className="w-3 h-3 text-yellow-500" /></span>
                </div>
              </div>
            </div>

            {/* Clues found Panel */}
            <div className="border-b border-border">
              <div className="p-2">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h3 className="text-md font-semibold text-foreground mt-1">Your Clues</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Green = phrase revealed, Orange = partial match
                  </p>
                </div>

              </div>
              
              <div className="p-2">
                {yesQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No clues yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ask correct questions to collect clues!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {yesQuestions.map((clue, index) => {
                      // Determine if this is a partial match (Yes answer but no phrase revealed)
                      const isPartialMatch = clue.answer === 'Yes' && !clue.phraseId;
                      
                      return (
                        <div 
                          key={index} 
                          className={cn(
                            "px-2 py-1 rounded",
                            isPartialMatch 
                              ? "text-orange-300 bg-orange-900/20" 
                              : "text-green-300 bg-green-900/20"
                          )}
                        >
                          <div className="flex items-start space-x-2">
                            {isPartialMatch ? (
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{clue.question}</p>
                              {isPartialMatch && (
                                <p className="text-xs text-orange-400/70 mt-1">
                                  Partial match - no phrase revealed
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Story Hints */}
            <div>
              <div className="p-2">
                <div className="flex items-center space-x-2">
                  <ShieldQuestionIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-md font-semibold text-foreground mt-1">Hints</h3>
                </div>
              </div>
              
              <div className="p-2">
                <div className="space-y-2">
                  {story.hints.map((hint, index) => {
                    const cost = index + 1
                    const isUnlocked = hintsUnlocked.includes(index)
                    const canAfford = coins >= cost
                    
                    return (
                      <div key={index} className="p-2 transition-all">
                        <div className="flex items-start space-x-2">
                          <span className="text-sm font-medium px-2 rounded-full mt-1">
                            Hint {index + 1}:
                          </span>
                          <div className="flex">
                            {isUnlocked ? (
                              <p className="text-sm text-blue-400 mt-1">{hint}</p>
                            ) : (
                              <div className="flex flex-col">
                                <button
                                  onClick={() => unlockHint(index)}
                                  disabled={!canAfford}
                                  className={cn(
                                    "flex items-center px-2 rounded text-sm font-medium transition-colors",
                                    canAfford
                                      ? "bg-yellow-900/30"
                                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                  )}
                                >
                                  <span className="mt-1 flex gap-1"> Unlock for {cost}<Coins className="w-3 h-3 text-yellow-500 mt-0.5" /></span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}