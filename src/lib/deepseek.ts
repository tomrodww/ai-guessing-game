import { StoryPhrase } from '@prisma/client';
import { generateAIPrompt, AIPromptResponse, processAIResponse, AffirmationEvaluationResult } from './ai-prompt';

/**
 * Evaluates a player's affirmation against story phrases using DeepSeek AI.
 * Uses a single, consolidated prompt for better accuracy and consistency.
 * @param affirmation The player's statement.
 * @param phrases An array of story phrase objects, each with an id and text.
 * @param context The overall story context known to the player.
 * @returns An evaluation result object.
 */
export async function evaluateAffirmationWithDeepSeek(
  affirmation: string,
  phrases: StoryPhrase[],
  context: string
): Promise<AffirmationEvaluationResult> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // Use the centralized prompt
    const prompt = generateAIPrompt(affirmation, phrases, context);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const result: AIPromptResponse = JSON.parse(data.choices[0].message.content);

    // Use the centralized response processing
    return processAIResponse(result, phrases, affirmation);

  } catch (error) {
    console.error('Error evaluating affirmation with DeepSeek:', error);
    // Fallback to a simple evaluation if DeepSeek fails
    return fallbackEvaluation(affirmation, phrases);
  }
}

/**
 * A simple fallback evaluation for when the AI is not available.
 */
function fallbackEvaluation(affirmation: string, phrases: StoryPhrase[]): AffirmationEvaluationResult {
  const affirmationLower = affirmation.toLowerCase().trim();
  
  // Reject single words or very short statements
  const words = affirmationLower.split(' ').filter(word => word.length > 0);
  if (words.length < 3) {
    return {
      answer: 'Irrelevant',
      explanation: 'Please make a complete statement with multiple words.',
      isPartialMatch: false
    };
  }
  
  // Look for EXTREMELY strong semantic matches that would warrant phrase revelation
  for (const phrase of phrases) {
    const phraseWords = phrase.text.toLowerCase().split(' ').filter(word => word.length > 2);
    const commonWords = words.filter(word => 
      word.length > 2 && phraseWords.some(pWord => pWord.includes(word) || word.includes(pWord))
    );
    
    // Require almost perfect match for phrase revelation (extremely strict)
    const similarity = commonWords.length / phraseWords.length;
    if (commonWords.length >= Math.max(4, Math.floor(phraseWords.length * 0.8)) && similarity >= 0.8) {
      return {
        answer: 'Yes',
        explanation: phrase.text,
        matchedPhraseId: phrase.id,
        isPartialMatch: false
      };
    }
  }
  
  // Check for partial matches that should get "Yes" but no phrase revelation
  for (const phrase of phrases) {
    const phraseWords = phrase.text.toLowerCase().split(' ').filter(word => word.length > 2);
    const commonWords = words.filter(word => 
      word.length > 2 && phraseWords.some(pWord => pWord.includes(word) || word.includes(pWord))
    );
    
    // Much lower threshold for confirming truth without revealing phrase
    if (commonWords.length >= 1) {
      return {
        answer: 'Yes',
        explanation: 'That statement is true but doesn\'t describe a complete sentence.',
        isPartialMatch: false
      };
    }
  }
  
  return {
    answer: 'Irrelevant',
    explanation: 'Could not determine relevance at this time.',
    isPartialMatch: false
  };
} 