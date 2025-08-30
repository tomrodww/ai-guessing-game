import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateQuestion } from '@/lib/ai-service'
import { QuestionResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { question, storyId, sessionId } = await request.json()

    if (!question || !storyId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate question length
    if (question.length > 50) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Question too long! Please keep it under 50 characters. (Current: ${question.length})` 
        },
        { status: 400 }
      )
    }

    // Validate question is not empty after trimming
    if (!question.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question cannot be empty' },
        { status: 400 }
      )
    }

    // Validate minimum word count
    const wordCount = question.trim().split(/\s+/).filter((word: string) => word.length > 0).length
    if (wordCount < 3) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Please use at least 3 words in your question. (Current: ${wordCount} word${wordCount !== 1 ? 's' : ''})` 
        },
        { status: 400 }
      )
    }

    // Get the story with phrases
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        phrases: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    // Evaluate the question using AI with phrases
    const evaluation = await evaluateQuestion(question, story.phrases, story.context)

    let response: QuestionResponse = {
      answer: evaluation.answer,
      explanation: evaluation.explanation || 'No explanation provided',
      isPartialMatch: evaluation.isPartialMatch || false,
      coinsEarned: 0 // Default to 0, will be updated if phrase discovered
    }

    // Save the question with its response
    const savedQuestion = await prisma.playerQuestion.create({
      data: {
        storyId: story.id,
        question,
        response: evaluation.answer,
        phraseId: evaluation.matchedPhraseId || null
      }
    })

    response.questionId = savedQuestion.id

    // Handle phrase discovery - only reveal if it's NOT a partial match
    if (evaluation.answer === 'Yes' && evaluation.matchedPhraseId && !evaluation.isPartialMatch) {
      const matchedPhrase = story.phrases.find(p => p.id === evaluation.matchedPhraseId)
      if (matchedPhrase) {
        response.phraseDiscovered = {
          id: matchedPhrase.id,
          order: matchedPhrase.order,
          text: matchedPhrase.text
        }

        // Update game session to track phrase revealed and add coins
        if (sessionId) {
          try {
            const sessionResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/game-session`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'reveal-phrase',
                sessionId,
                phraseId: matchedPhrase.id,
              }),
            })

            if (sessionResponse.ok) {
              const sessionResult = await sessionResponse.json()
              if (sessionResult.success) {
                response.coinsEarned = 3 // This matches the coins added in the session
              }
            }
          } catch (error) {
            console.error('Error updating game session for phrase reveal:', error)
            // Still give coins even if session update fails
            response.coinsEarned = 3
          }
        } else {
          // Fallback if no session
          response.coinsEarned = 3
        }

        // No need to mark questions as used since we removed that functionality

        // Check if all phrases are discovered in current session (story completed)
        if (sessionId) {
          // Get the game session to check phrases revealed in this session
          const gameSession = await prisma.gameSession.findUnique({
            where: { id: sessionId }
          })

          if (gameSession) {
            // Check unique phrases revealed in this session
            const sessionPhrasesRevealed = gameSession.phrasesRevealed
            
            if (sessionPhrasesRevealed >= story.phrases.length) {
              response.storyCompleted = true
            }
          }
        } else {
          // Fallback to old behavior if no session (shouldn't happen in normal flow)
          const discoveredPhrases = await prisma.playerQuestion.findMany({
            where: {
              storyId: story.id,
              response: 'Yes',
              phraseId: { not: null }
            },
            select: { phraseId: true },
            distinct: ['phraseId']
          })

          if (discoveredPhrases.length >= story.phrases.length) {
            response.storyCompleted = true
          }
        }
      }
    }
    
    // For partial matches, just confirm they're correct but don't reveal phrase
    // The "Yes" response itself tells them they're on the right track

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Error in question API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 