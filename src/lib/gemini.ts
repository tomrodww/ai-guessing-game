import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryPhrase } from '@prisma/client';
import { AIPromptResponse, processAIResponse, QuestionEvaluationResult } from './ai-prompt';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Create model with system instructions containing game rules
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
  },
  systemInstruction: `
    You are Game Master AI for a mystery guessing game. Your task is to analyze a player's question and return a single JSON object that summarizes your complete analysis.

    VERY IMPORTANT: The player knows the context, so you must consider the Context with the player's question to make a complete thought.

    ## YOUR ANALYSIS PROCESS (Follow these steps) ##

    **Step 1: Initial Status Check**
    First, determine the basic status of the player's question by comparing it against the Story Phrases and the Context.
- Is the question **"correct"**? (Directly supported or logically inferred from the phrases/context)
- Is the question **"incorrect"**? (Directly contradicted by the phrases/context)
- Is the question **"irrelevant"**? (Cannot be verified; contains outside information)

    **Step 2: Phrase Revelation Analysis (ONLY if status is "correct" in the previous step 1)**
    If and only if the question is "correct", you must then decide if it's enough to reveal one of the secret phrases.

    **Revelation Rules:**
    - **Rule A: Must Be a Complete Question.** Single-word guesses ("doctor", "intact") or nonsensical fragments ("they to go") do NOT reveal a phrase, even if related. The question must be a meaningful question.
    - **Rule B: Must Match the CORE IDEA.** The question must capture the primary subject or action of a single phrase. Synonyms are acceptable (e.g., "Is he combating a fire?" for "fighting a fire").
    - **Rule C: Must Not Omit Key Details.** If a phrase is "One survivor was missing an arm AND a leg", the question "Is one missing an arm?" is INSUFFICIENT because it omits the missing "leg".
    - **Rule D: Return the PHRASE_ID and TEXT referent to the phrase that is revealed.**

    **CRITICAL: If you decide to reveal a phrase, you MUST use the EXACT PHRASE_ID from the provided list (the unique identifier string).**

    **Example Analysis:**
    - PHRASE_ID: "phrase_abc123" | TEXT: "One survivor was a doctor"
    - Player Question: "Is there a doctor?"
    - Analysis: Correct. A complete question and captures the core idea.
    - Result: { "status": "correct", "shouldReveal": true, "phraseId": "phrase_abc123", "phraseText": "One survivor was a doctor", "reasoning": "Question directly confirms the doctor's existence." }

    - PHRASE_ID: "phrase_def456" | TEXT: "They took the doctor's leg instead."
    - Player Question: "Did they take his leg?"
    - Analysis: Correct, BUT not specific enough to reveal. It's a true question, but too generic. It's a partial match.
    - Result: { "status": "correct", "shouldReveal": false, "phraseId": "", "phraseText": "", "reasoning": "Question is true but too vague; doesn't specify whose leg or the context." }
    
    - Player Question: "Is the car red?"
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
  question: string,
  phrases: StoryPhrase[],
  context: string
): string {
  return `
## GAME DATA ##

**Overall Context (Already known by the player):**
${context}

**Secret Story Phrases (The player must guess these):**
${phrases.map((phrase, index) => `PHRASE_ID: "${phrase.id}" | TEXT: "${phrase.text}"`).join('\n')}

## PLAYER'S QUESTION TO ANALYZE ##
"${question}"

  `;
}

/**
 * Evaluates a player's question against story phrases using Gemini AI.
 * Uses a single, consolidated prompt for better accuracy and consistency.
 * @param question The player's question.
 * @param phrases An array of story phrase objects, each with an id and text.
 * @param context The overall story context known to the player.
 * @returns An evaluation result object.
 */
export async function evaluateQuestion(
  question: string,
  phrases: StoryPhrase[],
  context: string
): Promise<QuestionEvaluationResult> {
  try {
    console.log('🔮 Evaluating with Gemini (System Instructions):', { 
      question, 
      phraseCount: phrases.length,
      contextLength: context.length 
    });

    // Use the optimized prompt with only story-specific data
    const prompt = generateOptimizedPrompt(question, phrases, context);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('🔮 Gemini raw response:', responseText);

    // Parse the JSON response
    const response: AIPromptResponse = JSON.parse(responseText);

    // Use the centralized response processing
    return processAIResponse(response, phrases, question);

  } catch (error) {
    console.error('Error evaluating question with Gemini:', error);
    return fallbackEvaluation(question, phrases);
  }
}

/**
 * A simple fallback evaluation for when the AI is not available.
 */
function fallbackEvaluation(question: string, phrases: StoryPhrase[]): QuestionEvaluationResult {
    // This function can remain as a safety net.
    // For simplicity, we'll return a generic error message.
    return {
        answer: 'Irrelevant',
        explanation: 'There was an issue contacting the game master. Please try again.',
        isPartialMatch: false
    };
}
