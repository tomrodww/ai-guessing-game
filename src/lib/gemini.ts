import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryPhrase } from '@prisma/client';
import { generateAIPrompt, AIPromptResponse, processAIResponse, AffirmationEvaluationResult } from './ai-prompt';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Use the centralized prompt
    const prompt = generateAIPrompt(affirmation, phrases, context);

    const result = await model.generateContent(prompt);
    const response: AIPromptResponse = JSON.parse(result.response.text());

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
