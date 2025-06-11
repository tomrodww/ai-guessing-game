import { GoogleGenerativeAI } from '@google/generative-ai'
import { Discovery } from '@prisma/client'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface EvaluationResult {
  answer: 'Yes' | 'No' | 'Irrelevant'
  explanation?: string
  matchedDiscovery?: Discovery
}

/**
 * Evaluates a player's question against story context and discoveries
 * using Gemini AI to determine if the question is relevant and what the answer should be
 */
export async function evaluateQuestion(
  question: string,
  storyContext: string,
  discoveries: Discovery[]
): Promise<EvaluationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Create the prompt for Gemini
    const prompt = `
You are an AI helping to evaluate questions in a story-based guessing game. 

STORY CONTEXT:
${storyContext}

DISCOVERABLE FACTS:
${discoveries.map((d, i) => `${i + 1}. ${d.fact} (Keywords: ${d.keywords})`).join('\n')}

PLAYER QUESTION: "${question}"

Your task is to:
1. Determine if the question is relevant to the story
2. If relevant, answer "Yes" or "No" based on the story context and discoverable facts
3. If the question matches or is very close to one of the discoverable facts, indicate which one

Respond in this exact JSON format:
{
  "answer": "Yes" | "No" | "Irrelevant",
  "explanation": "Brief explanation of your reasoning",
  "matchedDiscoveryIndex": null or the index number (0-based) of the matched discovery
}

Rules:
- Answer "Irrelevant" if the question is not related to the story context
- Answer "Yes" if the question can be confirmed by the story context or discoverable facts
- Answer "No" if the question contradicts the story context or is not supported by it
- Be generous with matches - if the question is semantically similar to a discoverable fact, consider it a match
- Keep explanations brief and helpful
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const parsed = JSON.parse(text)
    
    // Build the result
    const evaluationResult: EvaluationResult = {
      answer: parsed.answer,
      explanation: parsed.explanation,
    }

    // If a discovery was matched, include it
    if (parsed.matchedDiscoveryIndex !== null && 
        parsed.matchedDiscoveryIndex >= 0 && 
        parsed.matchedDiscoveryIndex < discoveries.length) {
      evaluationResult.matchedDiscovery = discoveries[parsed.matchedDiscoveryIndex]
    }

    return evaluationResult

  } catch (error) {
    console.error('Error evaluating question with Gemini:', error)
    
    // Fallback: simple keyword matching
    return fallbackEvaluation(question, discoveries)
  }
}

/**
 * Fallback evaluation using simple keyword matching
 * Used when Gemini AI is not available or returns an error
 */
function fallbackEvaluation(question: string, discoveries: Discovery[]): EvaluationResult {
  const questionLower = question.toLowerCase()
  
  // Check if question matches any discovery keywords
  for (const discovery of discoveries) {
    const keywords = discovery.keywords.toLowerCase().split(',')
    const hasMatch = keywords.some(keyword => 
      questionLower.includes(keyword.trim()) || 
      keyword.trim().includes(questionLower)
    )
    
    if (hasMatch) {
      return {
        answer: 'Yes',
        explanation: 'This question relates to something important in the story.',
        matchedDiscovery: discovery
      }
    }
  }
  
  // Simple relevance check - if question contains common story words
  const storyWords = ['who', 'what', 'where', 'when', 'why', 'how', 'did', 'was', 'is', 'are']
  const isRelevant = storyWords.some(word => questionLower.includes(word))
  
  if (isRelevant) {
    return {
      answer: 'No',
      explanation: 'This question is relevant but the answer is no based on the current information.'
    }
  }
  
  return {
    answer: 'Irrelevant',
    explanation: 'This question doesn\'t seem related to the current story.'
  }
}

/**
 * Generate a hint or story continuation using Gemini AI
 * This is for future expansion of AI capabilities
 */
export async function generateStoryContent(
  prompt: string,
  context: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const fullPrompt = `
Context: ${context}

Task: ${prompt}

Please generate appropriate content that fits the story context and maintains consistency.
`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()

  } catch (error) {
    console.error('Error generating story content:', error)
    return 'Unable to generate content at this time.'
  }
} 