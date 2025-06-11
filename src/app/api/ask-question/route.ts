import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { evaluateQuestion } from '@/lib/gemini'
import { QuestionResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { question, storyId, blockId } = await request.json()

    if (!question || !storyId || !blockId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the story block with discoveries
    const storyBlock = await prisma.storyBlock.findUnique({
      where: { id: blockId },
      include: {
        discoveries: true,
        story: {
          include: {
            theme: true
          }
        }
      }
    })

    if (!storyBlock) {
      return NextResponse.json(
        { success: false, error: 'Story block not found' },
        { status: 404 }
      )
    }

    // Only consider undiscovered facts for evaluation
    const undiscoveredFacts = storyBlock.discoveries.filter(d => !d.isDiscovered)

    // Build story context for AI evaluation
    const storyContext = `
Story: ${storyBlock.story.title}
Theme: ${storyBlock.story.theme.name}
Current Block: ${storyBlock.title}
Current Hint: ${storyBlock.updatedHint || storyBlock.initialHint}
Description: ${storyBlock.story.description}
    `.trim()

    // Evaluate the question using AI
    const evaluation = await evaluateQuestion(question, storyContext, undiscoveredFacts)

    let response: QuestionResponse = {
      answer: evaluation.answer,
      explanation: evaluation.explanation
    }

    // Handle discovery made
    if (evaluation.matchedDiscovery) {
      // Mark the discovery as found
      await prisma.discovery.update({
        where: { id: evaluation.matchedDiscovery.id },
        data: { isDiscovered: true }
      })

      response.discoveryMade = {
        fact: evaluation.matchedDiscovery.fact,
        blockId: storyBlock.id
      }

      // Check if all discoveries in this block are now complete
      const remainingDiscoveries = await prisma.discovery.count({
        where: {
          storyBlockId: storyBlock.id,
          isDiscovered: false
        }
      })

      if (remainingDiscoveries === 0) {
        // Mark block as completed and update hint
        await prisma.storyBlock.update({
          where: { id: storyBlock.id },
          data: { isCompleted: true }
        })

        response.blockCompleted = true

        // Check if all blocks in the story are completed
        const remainingBlocks = await prisma.storyBlock.count({
          where: {
            storyId: storyBlock.storyId,
            isCompleted: false
          }
        })

        if (remainingBlocks === 0) {
          response.storyCompleted = true
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Error in ask-question API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    )
  }
} 