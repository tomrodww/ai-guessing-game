import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for game sessions (temporary solution)
// In production, this would be stored in the database
const gameSessions = new Map<string, {
  storyId: string
  coins: number
  hintsUnlocked: number[]
  phrasesRevealed: number
  startedAt: Date
}>()

export async function POST(request: NextRequest) {
  try {
    const { action, storyId, sessionId, hintIndex, coins } = await request.json()

    switch (action) {
      case 'start':
        if (!storyId) {
          return NextResponse.json(
            { success: false, error: 'Story ID required' },
            { status: 400 }
          )
        }
        
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        gameSessions.set(newSessionId, {
          storyId,
          coins: 7,
          hintsUnlocked: [],
          phrasesRevealed: 0,
          startedAt: new Date()
        })
        
        return NextResponse.json({
          success: true,
          data: {
            sessionId: newSessionId,
            coins: 7,
            hintsUnlocked: []
          }
        })

      case 'unlock-hint':
        if (!sessionId || hintIndex === undefined) {
          return NextResponse.json(
            { success: false, error: 'Session ID and hint index required' },
            { status: 400 }
          )
        }

        const session = gameSessions.get(sessionId)
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

        session.coins -= cost
        session.hintsUnlocked.push(hintIndex)
        
        return NextResponse.json({
          success: true,
          data: {
            coins: session.coins,
            hintsUnlocked: session.hintsUnlocked
          }
        })

      case 'update-coins':
        if (!sessionId || coins === undefined) {
          return NextResponse.json(
            { success: false, error: 'Session ID and coins required' },
            { status: 400 }
          )
        }

        const updateSession = gameSessions.get(sessionId)
        if (!updateSession) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }

        updateSession.coins = coins
        
        return NextResponse.json({
          success: true,
          data: {
            coins: updateSession.coins
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

    const session = gameSessions.get(sessionId)
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