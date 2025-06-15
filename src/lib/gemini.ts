import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryPhrase } from '@prisma/client';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AffirmationEvaluationResult {
  answer: 'Yes' | 'No' | 'Irrelevant';
  explanation?: string;
  matchedPhraseId?: string;
  isPartialMatch?: boolean;
}

/**
 * Evaluates a player's affirmation against story phrases using Gemini AI.
 * The AI is instructed to return a structured JSON response for reliable parsing.
 * @param affirmation The player's statement.
 * @param phrases An array of story phrase objects, each with an id and text.
 * @returns An evaluation result object.
 */
export async function evaluateAffirmation(
  affirmation: string,
  phrases: StoryPhrase[]
): Promise<AffirmationEvaluationResult> {
  try {
    // Using a model that supports JSON output is key.
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

         // The prompt is now much more robust. It tells the AI exactly what JSON to return.
     const prompt = `
You are the Game Master for a text-based guessing game. You must evaluate player statements against story sentences.

Story Sentences:
${phrases.map((phrase) => `ID: ${phrase.id} - "${phrase.text}"`).join('\n')}

CRITICAL RULES:
- "correct": The player's statement must convey the COMPLETE MEANING of one of the sentences above. Single words or partial concepts are NOT enough.
- "incorrect": The player's statement directly contradicts information in the sentences
- "irrelevant": The player's statement cannot be proven true or false from the sentences

EXAMPLES:
❌ Player says "intact" → This is just one word, not a complete meaning
❌ Player says "doctor" → This is just one word, not a complete meaning  
✅ Player says "The survivors were intact" → This conveys complete meaning
✅ Player says "There was a doctor among the survivors" → This conveys complete meaning

The player must express a COMPLETE IDEA or FACT, not just mention a keyword.

Player Statement: "${affirmation}"

Respond with JSON in this exact format:
{
  "status": "correct" | "incorrect" | "irrelevant",
  "phraseId": "the exact ID of the matching sentence if correct, empty string otherwise"
}
     `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response from the AI.
    const aiResponse = JSON.parse(responseText);

         // Now, we map the structured AI response to our desired result format.
     const status = aiResponse.status;
     const phraseId = aiResponse.phraseId;

     if (status === 'correct' && phraseId) {
       const matchedPhrase = phrases.find(p => p.id === phraseId);
       return {
         answer: 'Yes',
         explanation: matchedPhrase?.text || 'Phrase revealed',
         matchedPhraseId: phraseId,
         isPartialMatch: false,
       };
     } else if (status === 'incorrect') {
       return {
         answer: 'No',
         explanation: 'That statement is incorrect.',
         isPartialMatch: false,
       };
     } else { // 'irrelevant'
       return {
         answer: 'Irrelevant',
         explanation: 'That statement is irrelevant to the story.',
         isPartialMatch: false,
       };
     }

  } catch (error) {
    console.error('Error evaluating affirmation with Gemini:', error);
    // The fallback function is a great idea for handling API errors.
    // Make sure it returns data in the same format.
    return fallbackEvaluation(affirmation, phrases);
  }
}

/**
 * A simple fallback evaluation for when the AI is not available.
 * This is a simplified version and can be expanded.
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
     
     // Look for semantic matches with multiple key words
     for (const phrase of phrases) {
         const phraseWords = phrase.text.toLowerCase().split(' ').filter(word => word.length > 2);
         const commonWords = words.filter(word => 
             word.length > 2 && phraseWords.some(pWord => pWord.includes(word) || word.includes(pWord))
         );
         
         // Require at least 2 meaningful words to match and good coverage
         if (commonWords.length >= 2 && commonWords.length / Math.max(words.length, 3) >= 0.4) {
             return {
                 answer: 'Yes',
                 explanation: phrase.text,
                 matchedPhraseId: phrase.id,
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
