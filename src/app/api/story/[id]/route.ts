import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const story = await prisma.story.findUnique({
      where: {
        id,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        theme: true,
        phrases: {
          select: {
            id: true
          }
        }
      }
    })

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      story
    })
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 