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

    // Get all affirmations for this session that revealed phrases
    const revealedAffirmations = await prisma.playerAffirmation.findMany({
      where: {
        storyId: storyId,
        response: 'Yes',
        phraseId: { not: null }
      },
      select: {
        phraseId: true
      },
      distinct: ['phraseId']
    })

    // Get the actual phrase texts for revealed phrases only
    const revealedPhraseIds = revealedAffirmations
      .map(aff => aff.phraseId)
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