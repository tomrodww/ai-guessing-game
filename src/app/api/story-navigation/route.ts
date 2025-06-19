import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentStoryId = searchParams.get('storyId')

    if (!currentStoryId) {
      return NextResponse.json(
        { success: false, error: 'Story ID required' },
        { status: 400 }
      )
    }

    // Get all active stories in the same order as the home page
    const stories = await prisma.story.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        title: true,
        theme: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { theme: { name: 'asc' } },
        { title: 'asc' }
      ]
    })

    // Find the current story index
    const currentIndex = stories.findIndex(story => story.id === currentStoryId)

    if (currentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    // Get previous and next stories
    const previousStory = currentIndex > 0 ? stories[currentIndex - 1] : null
    const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null

    return NextResponse.json({
      success: true,
      data: {
        previous: previousStory ? {
          id: previousStory.id,
          title: previousStory.title,
          themeName: previousStory.theme.name
        } : null,
        next: nextStory ? {
          id: nextStory.id,
          title: nextStory.title,
          themeName: nextStory.theme.name
        } : null,
        current: {
          index: currentIndex + 1,
          total: stories.length
        }
      }
    })

  } catch (error) {
    console.error('Error in story navigation API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 