import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateAffirmation } from '@/lib/gemini'
import { AffirmationResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { affirmation, storyId } = await request.json()

    if (!affirmation || !storyId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the story with phrases
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        theme: true,
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

    // Evaluate the affirmation using AI with phrases
    const evaluation = await evaluateAffirmation(affirmation, story.phrases)

    let response: AffirmationResponse = {
      answer: evaluation.answer,
      explanation: evaluation.explanation
    }

    // Save the affirmation with its response
    const savedAffirmation = await prisma.playerAffirmation.create({
      data: {
        storyId: story.id,
        affirmation,
        response: evaluation.answer,
        phraseId: evaluation.matchedPhraseId || null
      }
    })

    response.affirmationId = savedAffirmation.id

    // Handle phrase discovery - only reveal if it's NOT a partial match
    if (evaluation.answer === 'Yes' && evaluation.matchedPhraseId && !evaluation.isPartialMatch) {
      const matchedPhrase = story.phrases.find(p => p.id === evaluation.matchedPhraseId)
      if (matchedPhrase) {
        response.phraseDiscovered = {
          id: matchedPhrase.id,
          order: matchedPhrase.order,
          text: matchedPhrase.text
        }

        // Mark related affirmations as used
        await prisma.playerAffirmation.updateMany({
          where: {
            storyId: story.id,
            phraseId: matchedPhrase.id
          },
          data: {
            isUsed: true
          }
        })

        // Check if all phrases are discovered (story completed)
        const discoveredPhrases = await prisma.playerAffirmation.findMany({
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
    
    // For partial matches, just confirm they're correct but don't reveal phrase
    // The "Yes" response itself tells them they're on the right track

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Error in affirmation API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 