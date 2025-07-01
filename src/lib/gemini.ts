import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryPhrase } from '@prisma/client';
import { AIPromptResponse, processAIResponse, AffirmationEvaluationResult } from './ai-prompt';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Create model with system instructions containing game rules
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
  },
  systemInstruction: `
    You are Game Master AI for a mystery guessing game. Your task is to analyze a player's statement and return a single JSON object that summarizes your complete analysis.

    VERY IMPORTANT: The player knows the context, so you must consider the Context with the players statement to make a complete thought.

    ## YOUR ANALYSIS PROCESS (Follow these steps) ##

    **Step 1: Initial Status Check**
    First, determine the basic status of the player's statement by comparing it against the Story Phrases and the Context.
    - Is the statement **"correct"**? (Directly supported or logically inferred from the phrases/context)
    - Is the statement **"incorrect"**? (Directly contradicted by the phrases/context)
    - Is the statement **"irrelevant"**? (Cannot be verified; contains outside information)

    **Step 2: Phrase Revelation Analysis (ONLY if status is "correct" in the previous step 1)**
    If and only if the statement is "correct", you must then decide if it's enough to reveal one of the secret phrases.

    **Revelation Rules:**
    - **Rule A: Must Be a Complete Thought.** Single-word guesses ("doctor", "intact") or nonsensical fragments ("they to go") do NOT reveal a phrase, even if related. The statement must be a meaningful sentence.
    - **Rule B: Must Match the CORE IDEA.** The statement must capture the primary subject or action of a single phrase. Synonyms are acceptable (e.g., "combating a fire" for "fighting a fire").
    - **Rule C: Must Not Omit Key Details.** If a phrase is "One survivor was missing an arm AND a leg", the statement "one was missing an arm" is INSUFFICIENT because it omits the missing "leg".
    - **Rule D: Return the PHRASE_ID and TEXT referent to the phrase that is revealed.**

    **CRITICAL: If you decide to reveal a phrase, you MUST use the EXACT PHRASE_ID from the provided list (the unique identifier string).**

    **Example Analysis:**
    - PHRASE_ID: "phrase_abc123" | TEXT: "One survivor was a doctor"
    - Player Statement: "there was a doctor"
    - Analysis: Correct. A complete thought and captures the core idea.
    - Result: { "status": "correct", "shouldReveal": true, "phraseId": "phrase_abc123", "phraseText": "One survivor was a doctor", "reasoning": "Statement directly confirms the doctor's existence." }

    - PHRASE_ID: "phrase_def456" | TEXT: "They took the doctor's leg instead."
    - Player Statement: "they took his leg"
    - Analysis: Correct, BUT not specific enough to reveal. It's a true statement, but too generic. It's a partial match.
    - Result: { "status": "correct", "shouldReveal": false, "phraseId": "", "phraseText": "", "reasoning": "Statement is true but too vague; doesn't specify whose leg or the context." }
    
    - Player Statement: "the car was red"
    - Analysis: No mention of a car. Irrelevant.
    - Result: { "status": "irrelevant", "shouldReveal": false, "phraseId": "", "phraseText": "", "reasoning": "The story does not mention a car." }

    ## REQUIRED JSON OUTPUT ##
    Respond with ONLY the following JSON object. Do not add any text before or after it.

    IMPORTANT: If shouldReveal is true, use the exact PHRASE_ID (the unique identifier string) and exact TEXT from the list. If shouldReveal is false, use empty string for phraseId and phraseText.

    {
      "status": "correct" | "incorrect" | "irrelevant",
      "shouldReveal": true | false,
      "phraseId": "PHRASE_ID",
      "phraseText": "TEXT",
      "reasoning": "A brief explanation for your decision."
    }
  `
});

// Generate optimized prompt with only story-specific data
function generateOptimizedPrompt(
  affirmation: string,
  phrases: StoryPhrase[],
  context: string
): string {
  return `
## GAME DATA ##

**Overall Context (Already known by the player):**
${context}

**Secret Story Phrases (The player must guess these):**
${phrases.map((phrase, index) => `PHRASE_ID: "${phrase.id}" | TEXT: "${phrase.text}"`).join('\n')}

## PLAYER'S STATEMENT TO ANALYZE ##
"${affirmation}"

  `;
}

/**
 * Evaluates a player's affirmation against story phrases using Gemini AI.
 * Uses a single, consolidated prompt for better accuracy and consistency.
 * @param affirmation The player's statement.
 * @param phrases An array of story phrase objects, each with an id and text.
 * @param context The overall story context known to the player.
 * @returns An evaluation result object.
 */
export async function evaluateAffirmation(
  affirmation: string,
  phrases: StoryPhrase[],
  context: string
): Promise<AffirmationEvaluationResult> {
  try {
    console.log('🔮 Evaluating with Gemini (System Instructions):', { 
      affirmation, 
      phraseCount: phrases.length,
      contextLength: context.length 
    });

    // Use the optimized prompt with only story-specific data
    const prompt = generateOptimizedPrompt(affirmation, phrases, context);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('🔮 Gemini raw response:', responseText);

    // Parse the JSON response
    const response: AIPromptResponse = JSON.parse(responseText);

    // Use the centralized response processing
    return processAIResponse(response, phrases, affirmation);

  } catch (error) {
    console.error('Error evaluating affirmation with Gemini:', error);
    return fallbackEvaluation(affirmation, phrases);
  }
}

/**
 * A simple fallback evaluation for when the AI is not available.
 */
function fallbackEvaluation(affirmation: string, phrases: StoryPhrase[]): AffirmationEvaluationResult {
    // This function can remain as a safety net.
    // For simplicity, we'll return a generic error message.
    return {
        answer: 'Irrelevant',
        explanation: 'There was an issue contacting the game master. Please try again.',
        isPartialMatch: false
    };
}
