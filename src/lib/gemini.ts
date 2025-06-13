import { GoogleGenerativeAI } from '@google/generative-ai'
import { StoryPhrase } from '@prisma/client'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface EvaluationResult {
  answer: 'Yes' | 'No' | 'Irrelevant'
  explanation?: string
  matchedDiscovery?: StoryPhrase
}

export interface SolutionEvaluationResult {
  isCorrect: boolean
  explanation: string
  similarity: number // 0-100 percentage of how close the answer is
}

export interface AffirmationEvaluationResult {
  answer: 'Yes' | 'No' | 'Irrelevant'
  explanation?: string
  matchedPhraseId?: string
}

/**
 * Evaluates a player's question against story context and discoveries
 * using Gemini AI to determine if the question is relevant and what the answer should be
 */
export async function evaluateQuestion(
  question: string,
  storyContext: string,
  facts: StoryPhrase[]
): Promise<EvaluationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create the enhanced prompt for Gemini
    const prompt = `
You are an intelligent game master for a mystery guessing game. Your job is to analyze player questions and provide accurate, logical responses.

STORY CONTEXT:
${storyContext}

DISCOVERABLE FACTS (things players need to discover):
${facts.map((f, i) => `${i + 1}. ${f.text}`).join('\n')}

PLAYER INPUT: "${question}"

CRITICAL EVALUATION RULES:

1. QUESTION VALIDATION:
   - Is this actually a proper question? (not just keywords or statements)
   - Does it make grammatical and logical sense?
   - Is it a yes/no question or can it be reasonably answered with yes/no?

2. RELEVANCE CHECK:
   - Is the question related to the story context?
   - Does it ask about elements that could reasonably exist in this scenario?
   - Reject questions about completely unrelated topics

3. LOGICAL REASONING:
   - Based on the story context, what would be the logical answer?
   - Consider physics, human behavior, and common sense
   - Don't just match keywords - understand the meaning

4. DISCOVERY MATCHING:
   - If the question directly asks about or implies one of the discoverable facts, mark it as a discovery
   - Only match if the question semantically asks about the same concept, not just similar words

5. ANSWER GUIDELINES:
   - "Yes": The question asks about something that is true based on the story context or discoverable facts
   - "No": The question asks about something that is false or contradicted by the story
   - "Irrelevant": The question is not a proper question, not related to the story, or cannot be reasonably answered

EXAMPLES OF INVALID INPUTS:
- Just keywords like "window" or "rain"
- Statements like "There is a window"
- Non-questions like "elevator button"
- Completely unrelated topics

EXAMPLES OF GOOD QUESTIONS:
- "Was the window open?"
- "Did it rain that day?"
- "Could he reach the elevator button?"

Respond in this exact JSON format:
{
  "answer": "Yes" | "No" | "Irrelevant",
  "explanation": "Clear explanation of your reasoning (why this answer makes sense)",
  "matchedDiscoveryIndex": null or the index number (0-based) of the matched discovery,
  "isValidQuestion": true/false
}

IMPORTANT: Be strict about question validity. Random keywords or statements should be marked as "Irrelevant" with "isValidQuestion": false.
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

    // If a fact was matched, include it
    if (parsed.matchedDiscoveryIndex !== null && 
        parsed.matchedDiscoveryIndex >= 0 && 
        parsed.matchedDiscoveryIndex < facts.length) {
      evaluationResult.matchedDiscovery = facts[parsed.matchedDiscoveryIndex]
    }

    return evaluationResult

  } catch (error) {
    console.error('Error evaluating question with Gemini:', error)
    
    // Improved fallback evaluation
    return intelligentQuestionFallback(question, facts)
  }
}

/**
 * Intelligent fallback evaluation when AI is not available
 * Still validates questions and provides logical responses
 */
function intelligentQuestionFallback(question: string, facts: StoryPhrase[]): EvaluationResult {
  const questionLower = question.toLowerCase().trim()
  
  // 1. Validate if this is actually a question
  const questionWords = ['what', 'where', 'when', 'why', 'how', 'who', 'is', 'was', 'were', 'are', 'did', 'does', 'do', 'can', 'could', 'would', 'will']
  const hasQuestionWord = questionWords.some(word => questionLower.includes(word))
  const hasQuestionMark = question.includes('?')
  const isLikelyQuestion = hasQuestionWord || hasQuestionMark
  
  // Check if it's just keywords (too short or no question structure)
  const wordCount = questionLower.split(' ').filter(word => word.length > 0).length
  
  if (!isLikelyQuestion || wordCount < 3) {
    return {
      answer: 'Irrelevant',
      explanation: 'Please ask a complete question. For example: "Was the door locked?" or "Did someone enter through the window?"'
    }
  }
  
  // 2. Check for phrase matches (semantic, not just keyword)
  for (const phrase of facts) {
    const phraseWords = phrase.text.toLowerCase().split(' ')
    
    // More intelligent matching - check if question asks about the concept
    const conceptMatch = phraseWords.some(word => {
      if (word.length > 3) { // Only check meaningful words
        return questionLower.includes(word)
      }
      return false
    })
    
    if (conceptMatch) {
      return {
        answer: 'Yes',
        explanation: `Yes, this relates to an important detail in the story.`,
        matchedDiscovery: phrase
      }
    }
  }
  
  // 3. Basic story relevance check
  const storyIndicators = ['door', 'window', 'room', 'house', 'building', 'person', 'man', 'woman', 'time', 'day', 'night']
  const seemsRelevant = storyIndicators.some(indicator => questionLower.includes(indicator))
  
  if (seemsRelevant) {
    return {
      answer: 'No',
      explanation: 'This is a good question, but the answer is no based on the current story information.'
    }
  }
  
  // 4. Check for completely irrelevant topics
  const irrelevantTopics = ['food', 'sports', 'politics', 'music', 'movies', 'tv', 'internet', 'phone', 'computer']
  const isIrrelevant = irrelevantTopics.some(topic => questionLower.includes(topic))
  
  if (isIrrelevant) {
    return {
      answer: 'Irrelevant',
      explanation: 'This question is not related to the current story. Try asking about the characters, setting, or events in the mystery.'
    }
  }
  
  // 5. Default to uncertain but relevant
  return {
    answer: 'No',
    explanation: 'This seems like a relevant question, but the answer is no based on what we know so far.'
  }
}

/**
 * Evaluates if a player's solution guess matches the actual story solution
 */
export async function evaluateSolution(
  playerSolution: string,
  actualSolution: string,
  storyTitle: string
): Promise<SolutionEvaluationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `
You are evaluating whether a player's solution guess matches the actual solution to a mystery story.

STORY: "${storyTitle}"

ACTUAL SOLUTION:
${actualSolution}

PLAYER'S GUESS:
"${playerSolution}"

Your task is to determine:
1. Does the player's guess capture the core elements of the actual solution?
2. How similar is their understanding to the correct answer?
3. Are they essentially correct even if the wording is different?

EVALUATION CRITERIA:
- Look for semantic similarity, not exact word matching
- The player should understand the main mechanism/reason
- Minor details can be different, but core logic must match
- Give credit for correct understanding even with different phrasing

EXAMPLES OF CORRECT MATCHES:
- Actual: "He uses umbrella to press elevator button"
- Player: "He's too short so uses his umbrella to reach the button" ✓

EXAMPLES OF INCORRECT:
- Actual: "He uses umbrella to press elevator button" 
- Player: "He's afraid of elevators on sunny days" ✗

Respond in this exact JSON format:
{
  "isCorrect": true/false,
  "explanation": "Clear explanation of why this is correct/incorrect and what elements they got right or missed",
  "similarity": 0-100 (percentage similarity even if not fully correct)
}

Be encouraging but accurate. If they're close but not quite right, explain what they're missing.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const parsed = JSON.parse(text)
    
    return {
      isCorrect: parsed.isCorrect,
      explanation: parsed.explanation,
      similarity: parsed.similarity || 0
    }

  } catch (error) {
    console.error('Error evaluating solution with Gemini:', error)
    
    // Fallback: simple text comparison
    return fallbackSolutionEvaluation(playerSolution, actualSolution)
  }
}

/**
 * Fallback solution evaluation using simple text similarity
 */
function fallbackSolutionEvaluation(
  playerSolution: string,
  actualSolution: string
): SolutionEvaluationResult {
  const playerLower = playerSolution.toLowerCase().trim()
  const actualLower = actualSolution.toLowerCase().trim()
  
  // Extract key words from actual solution
  const actualWords = actualLower.split(/\s+/).filter(word => 
    word.length > 3 && !['the', 'and', 'but', 'for', 'with', 'from'].includes(word)
  )
  
  // Count how many key concepts the player mentioned
  const matchedWords = actualWords.filter(word => playerLower.includes(word))
  const similarity = Math.round((matchedWords.length / actualWords.length) * 100)
  
  const isCorrect = similarity >= 70 // 70% similarity threshold
  
  return {
    isCorrect,
    explanation: isCorrect 
      ? `Great job! You understood the core solution. Your answer captures the main elements: ${matchedWords.join(', ')}.`
      : `Close, but not quite right. You got some elements (${matchedWords.join(', ') || 'none'}), but missed key parts of the solution.`,
    similarity
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
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

/**
 * Evaluates a player's affirmation against story context and phrases
 * using Gemini AI to determine if the affirmation matches any of the story phrases
 */
export async function evaluateAffirmation(
  affirmation: string,
  storyContext: string,
  phrases: StoryPhrase[]
): Promise<AffirmationEvaluationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create the enhanced prompt for Gemini
    const prompt = `
You are an intelligent game master for an affirmation-based mystery game. Players make statements/affirmations, and you determine if they match the exact meaning of any story phrases.

STORY CONTEXT:
${storyContext}

STORY PHRASES TO MATCH:
${phrases.map((p, i) => `${p.id}: "${p.text}"`).join('\n')}

PLAYER AFFIRMATION: "${affirmation}"

CRITICAL EVALUATION RULES:

1. AFFIRMATION VALIDATION:
   - Is this a meaningful statement or claim?
   - Does it make grammatical and logical sense?
   - Reject random keywords, incomplete sentences, or nonsense

2. EXACT MEANING MATCH:
   - Does the affirmation express the SAME MEANING as any of the story phrases?
   - The wording doesn't need to be identical, but the meaning must be equivalent
   - Consider synonyms, different phrasings, and paraphrasing
   - Be strict - partial matches or vague similarities don't count

3. EXAMPLES OF VALID MATCHES:
   - Phrase: "The man was a dwarf" → Affirmation: "He was very short" ✓
   - Phrase: "Using the umbrella, he could reach the button" → Affirmation: "He used his umbrella to press the elevator button" ✓
   - Phrase: "On rainy days, he carried an umbrella" → Affirmation: "When it rained, he had an umbrella with him" ✓

4. EXAMPLES OF INVALID MATCHES:
   - Phrase: "The man was a dwarf" → Affirmation: "There was a man" ✗ (too vague)
   - Phrase: "He used the stairs" → Affirmation: "He walked" ✗ (not specific enough)
   - Random keywords like "umbrella" or "elevator" ✗

5. ANSWER GUIDELINES:
   - "Yes": The affirmation matches the exact meaning of one of the story phrases
   - "No": The affirmation is a valid statement but doesn't match any phrase meaning
   - "Irrelevant": The affirmation is invalid, nonsensical, or completely unrelated

IMPORTANT: Only return "Yes" if there's a clear, unambiguous match with one of the story phrases. When in doubt, choose "No" rather than "Yes".

Respond in this exact JSON format:
{
  "answer": "Yes" | "No" | "Irrelevant",
  "explanation": "Clear explanation of your reasoning",
  "matchedPhraseId": "phrase_id_if_matched" or null,
  "isValidAffirmation": true/false
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const parsed = JSON.parse(text)
    
    // Build the result
    const evaluationResult: AffirmationEvaluationResult = {
      answer: parsed.answer,
      explanation: parsed.explanation,
    }

    // If a phrase was matched, include its ID
    if (parsed.matchedPhraseId) {
      evaluationResult.matchedPhraseId = parsed.matchedPhraseId
    }

    return evaluationResult

  } catch (error) {
    console.error('Error evaluating affirmation with Gemini:', error)
    
    // Improved fallback evaluation
    return intelligentAffirmationFallback(affirmation, phrases)
  }
}

/**
 * Intelligent fallback evaluation when AI is not available
 * Still validates affirmations and provides logical responses
 */
function intelligentAffirmationFallback(affirmation: string, phrases: StoryPhrase[]): AffirmationEvaluationResult {
  const affirmationLower = affirmation.toLowerCase().trim()
  
  // 1. Validate if this is actually a meaningful statement
  const wordCount = affirmationLower.split(' ').filter(word => word.length > 0).length
  
  if (wordCount < 2) {
    return {
      answer: 'Irrelevant',
      explanation: 'Please make a complete statement. For example: "The man was short" or "He used an umbrella".'
    }
  }
  
  // 2. Check for phrase matches using keyword similarity
  for (const phrase of phrases) {
    const phraseWords = phrase.text.toLowerCase().split(' ')
    const affirmationWords = affirmationLower.split(' ')
    
    // Calculate word overlap
    const commonWords = phraseWords.filter(word => 
      word.length > 2 && affirmationWords.includes(word)
    )
    
    // If significant overlap (more than 50% of phrase words), consider it a match
    const overlapRatio = commonWords.length / phraseWords.length
    
    if (overlapRatio > 0.5) {
      return {
        answer: 'Yes',
        explanation: `Yes, this matches an important detail in the story.`,
        matchedPhraseId: phrase.id
      }
    }
  }
  
  // 3. Check if it's a reasonable statement about the story
  const storyIndicators = ['man', 'person', 'he', 'she', 'umbrella', 'elevator', 'stairs', 'button', 'floor', 'rain', 'sunny', 'day']
  const seemsRelevant = storyIndicators.some(indicator => affirmationLower.includes(indicator))
  
  if (seemsRelevant) {
    return {
      answer: 'No',
      explanation: 'This is a reasonable statement, but it doesn\'t match the exact details we\'re looking for.'
    }
  }
  
  // 4. Default to irrelevant for unclear statements
  return {
    answer: 'Irrelevant',
    explanation: 'This statement is not clear or not related to the current story. Try making specific claims about the characters or events.'
  }
} 