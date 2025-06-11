'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { StoryWithDetails, QuestionHistory, QuestionResponse } from '@/types'
import { getThemeColors, formatDuration, calculateProgress, cn } from '@/lib/utils'
import { 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  Sparkles,
  Trophy,
  RotateCcw
} from 'lucide-react'
import * as Icons from 'lucide-react'

interface GameInterfaceProps {
  story: StoryWithDetails
}

export function GameInterface({ story }: GameInterfaceProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [questions, setQuestions] = useState<QuestionHistory[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameStartTime] = useState(new Date())
  const [gameCompleted, setGameCompleted] = useState(false)
  const [discoveries, setDiscoveries] = useState<string[]>([])
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([])
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentBlock = story.blocks[currentBlockIndex]
  const totalBlocks = story.blocks.length
  const progress = calculateProgress(completedBlocks, totalBlocks)
  const IconComponent = Icons[story.theme.icon as keyof typeof Icons] as any
  const colors = getThemeColors(story.theme.color)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [questions])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submitQuestion = async () => {
    if (!currentQuestion.trim() || isSubmitting) return

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
          blockId: currentBlock.id,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const data: QuestionResponse = result.data

        // Add question to history
        const newQuestion: QuestionHistory = {
          question: questionText,
          answer: data.answer,
          timestamp: new Date(),
          explanation: data.explanation,
        }

        setQuestions(prev => [...prev, newQuestion])

        // Handle discovery
        if (data.discoveryMade) {
          setDiscoveries(prev => [...prev, data.discoveryMade!.fact])
        }

        // Handle block completion
        if (data.blockCompleted) {
          setCompletedBlocks(prev => [...prev, currentBlock.id])
          
          // Move to next block if available
          if (currentBlockIndex < totalBlocks - 1) {
            setTimeout(() => {
              setCurrentBlockIndex(prev => prev + 1)
            }, 2000)
          }
        }

        // Handle story completion
        if (data.storyCompleted) {
          setGameCompleted(true)
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
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitQuestion()
    }
  }

  const resetGame = () => {
    setCurrentBlockIndex(0)
    setQuestions([])
    setGameCompleted(false)
    setDiscoveries([])
    setCompletedBlocks([])
    // Note: In a real app, you'd also reset the database state
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              <div className="flex items-center gap-3">
                {IconComponent && (
                  <div className={cn('p-2 rounded-lg', colors.bg)}>
                    <IconComponent className={cn('h-5 w-5', colors.text)} />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{story.title}</h1>
                  <p className="text-sm text-gray-600">{story.theme.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(gameStartTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{questions.length} questions</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Block {currentBlockIndex + 1} of {totalBlocks}: {currentBlock.title}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Story Content */}
        <div className="flex-1 flex flex-col">
          {/* Current Hint */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="container mx-auto max-w-4xl">
              <div className={cn('p-6 rounded-xl border-2', colors.bg, colors.text)}>
                <h2 className="text-xl font-bold mb-3">{currentBlock.title}</h2>
                <p className="text-base leading-relaxed">
                  {currentBlock.updatedHint || currentBlock.initialHint}
                </p>
                
                {/* Discoveries for this block */}
                {discoveries.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Discoveries Made:
                    </h3>
                    <ul className="space-y-1">
                      {discoveries.map((discovery, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          {discovery}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="container mx-auto max-w-4xl space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Asking Questions!
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Ask yes/no questions to uncover the mystery. The AI will respond with "Yes", "No", or "Irrelevant" based on the story context.
                  </p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div key={index} className="space-y-3">
                    {/* Question */}
                    <div className="flex justify-end">
                      <div className="question-bubble">
                        {q.question}
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="flex justify-start">
                      <div className={cn(
                        'answer-bubble',
                        q.answer === 'Yes' && 'answer-yes',
                        q.answer === 'No' && 'answer-no',
                        q.answer === 'Irrelevant' && 'answer-irrelevant'
                      )}>
                        <div className="font-semibold text-sm mb-1">{q.answer}</div>
                        {q.explanation && (
                          <div className="text-sm opacity-90">{q.explanation}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Completion Message */}
              {gameCompleted && (
                <div className="text-center py-8">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
                    <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Mystery Solved! 🎉
                    </h3>
                    <p className="text-green-700 mb-4">
                      Congratulations! You've successfully uncovered all the secrets in this story.
                    </p>
                    <div className="space-y-2 text-sm text-green-600">
                      <div>Time: {formatDuration(gameStartTime)}</div>
                      <div>Questions asked: {questions.length}</div>
                      <div>Discoveries made: {discoveries.length}</div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <Link href="/" className="btn-primary block">
                        Play Another Story
                      </Link>
                      <button onClick={resetGame} className="btn-secondary w-full">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Play Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area */}
          {!gameCompleted && (
            <div className="bg-white border-t border-gray-200 p-6">
              <div className="container mx-auto max-w-4xl">
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a yes/no question about the story..."
                    className="input flex-1"
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={submitQuestion}
                    disabled={isSubmitting || !currentQuestion.trim()}
                    className="btn-primary px-6 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Ask
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ask questions like "Was the door locked?" or "Did someone break the window?"
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 