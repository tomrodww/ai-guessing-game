import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { action, storyId, sessionId, hintIndex, coins, phraseId, forceNew } = await request.json()

    switch (action) {
      case 'start':
        if (!storyId) {
          return NextResponse.json(
            { success: false, error: 'Story ID required' },
            { status: 400 }
          )
        }
        
        // Always create a new session (no session reuse for fresh games)
        const gameSession = await prisma.gameSession.create({
          data: {
            storyId,
            coins: 7,
            hintsUnlocked: [],
            phrasesRevealed: 0
          }
        })
        
        return NextResponse.json({
          success: true,
          data: {
            sessionId: gameSession.id,
            coins: gameSession.coins,
            hintsUnlocked: gameSession.hintsUnlocked
          }
        })

      case 'unlock-hint':
        if (!sessionId || hintIndex === undefined) {
          return NextResponse.json(
            { success: false, error: 'Session ID and hint index required' },
            { status: 400 }
          )
        }

        const session = await prisma.gameSession.findUnique({
          where: { id: sessionId }
        })

        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }

        const cost = hintIndex + 1
        if (session.coins < cost) {
          return NextResponse.json(
            { success: false, error: 'Insufficient coins' },
            { status: 400 }
          )
        }

        if (session.hintsUnlocked.includes(hintIndex)) {
          return NextResponse.json(
            { success: false, error: 'Hint already unlocked' },
            { status: 400 }
          )
        }

        const updatedSession = await prisma.gameSession.update({
          where: { id: sessionId },
          data: {
            coins: session.coins - cost,
            hintsUnlocked: [...session.hintsUnlocked, hintIndex]
          }
        })
        
        return NextResponse.json({
          success: true,
          data: {
            coins: updatedSession.coins,
            hintsUnlocked: updatedSession.hintsUnlocked
          }
        })

      case 'update-coins':
        if (!sessionId || coins === undefined) {
          return NextResponse.json(
            { success: false, error: 'Session ID and coins required' },
            { status: 400 }
          )
        }

        const updateSession = await prisma.gameSession.findUnique({
          where: { id: sessionId }
        })

        if (!updateSession) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }

        const updated = await prisma.gameSession.update({
          where: { id: sessionId },
          data: { coins }
        })
        
        return NextResponse.json({
          success: true,
          data: {
            coins: updated.coins
          }
        })

      case 'reveal-phrase':
        if (!sessionId || !phraseId) {
          return NextResponse.json(
            { success: false, error: 'Session ID and phrase ID required' },
            { status: 400 }
          )
        }

        const revealSession = await prisma.gameSession.findUnique({
          where: { id: sessionId }
        })

        if (!revealSession) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }

        // Increment phrases revealed count and add coin reward
        const revealUpdated = await prisma.gameSession.update({
          where: { id: sessionId },
          data: {
            phrasesRevealed: revealSession.phrasesRevealed + 1,
            coins: revealSession.coins + 3 // Reward 3 coins for phrase discovery
          }
        })
        
        return NextResponse.json({
          success: true,
          data: {
            coins: revealUpdated.coins,
            phrasesRevealed: revealUpdated.phrasesRevealed
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in game session API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        coins: session.coins,
        hintsUnlocked: session.hintsUnlocked,
        phrasesRevealed: session.phrasesRevealed
      }
    })

  } catch (error) {
    console.error('Error in game session API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 