import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateSolution } from '@/lib/gemini'
import { SolutionResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { storyId, playerSolution } = await request.json()

    if (!storyId || !playerSolution) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the story
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        title: true,
        solution: true
      }
    })

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    // Evaluate the solution using AI
    const evaluation = await evaluateSolution(
      playerSolution.trim(),
      story.solution,
      story.title
    )

    const response: SolutionResponse = {
      isCorrect: evaluation.isCorrect,
      explanation: evaluation.explanation,
      similarity: evaluation.similarity,
      actualSolution: evaluation.isCorrect ? undefined : story.solution
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Error in check-solution API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 