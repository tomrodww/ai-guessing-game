import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const storyId = searchParams.get('storyId')

    if (!sessionId || !storyId) {
      return NextResponse.json(
        { success: false, error: 'Session ID and Story ID required' },
        { status: 400 }
      )
    }

    // Get the session to verify it exists
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get all questions that revealed phrases for this specific session
    // We'll track this through the session's creation time
    const revealedQuestions = await prisma.playerQuestion.findMany({
      where: {
        storyId: storyId,
        response: 'Yes',
        phraseId: { not: null },
        createdAt: { gte: session.startedAt } // Only questions after session started
      },
      select: {
        phraseId: true
      },
      distinct: ['phraseId']
    })

    // Get the actual phrase texts for revealed phrases only
    const revealedPhraseIds = revealedQuestions
      .map(q => q.phraseId)
      .filter((id): id is string => id !== null)

    const revealedPhrases = await prisma.storyPhrase.findMany({
      where: {
        id: { in: revealedPhraseIds },
        storyId: storyId
      },
      select: {
        id: true,
        order: true,
        text: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        revealedPhrases: revealedPhrases
      }
    })

  } catch (error) {
    console.error('Error fetching revealed phrases:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 