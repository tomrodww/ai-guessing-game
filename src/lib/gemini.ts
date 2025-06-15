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

CRITICAL RULES FOR PHRASE REVELATION:
- A phrase should ONLY be revealed if the player's statement directly describes the COMPLETE MEANING of that exact sentence
- The player must mention ALL the KEY ELEMENTS that make that sentence unique and specific
- Missing ANY key element means NO phrase revelation, even if some elements are correct
- Related concepts, partial matches, or logical connections are NOT enough to reveal a phrase
- If the statement is true but doesn't describe a complete sentence, respond "correct_no_reveal"

EXAMPLES:
❌ Player says "there was water" → Don't reveal "The helicopter used lake water" (missing helicopter)
❌ Player says "there was a lake" → Don't reveal "The helicopter used lake water" (missing helicopter)
❌ Player says "there was a helicopter" → Don't reveal "A helicopter was fighting the fire" (missing fire)
❌ Player says "there was a fire" → Don't reveal "A helicopter was fighting the fire" (missing helicopter)
✅ Player says "a helicopter was fighting a fire" → Reveal "A helicopter was fighting the fire" (all elements present)
✅ Player says "the helicopter used water from a lake" → Reveal "The helicopter used lake water" (all elements present)
✅ Player says "he was diving in the lake" → Reveal "The man was diving in that lake" (all elements present)

KEY PRINCIPLE: Every important word/concept in the target sentence must be mentioned or clearly implied in the player's statement.

RESPONSE TYPES:
- "correct_reveal": Player's statement directly describes the complete meaning of a specific sentence
- "correct_no_reveal": Player's statement is true but doesn't describe a complete sentence
- "incorrect": Player's statement contradicts the story
- "irrelevant": Player's statement cannot be determined from the story

Player Statement: "${affirmation}"

Respond with JSON in this exact format:
{
  "status": "correct_reveal" | "correct_no_reveal" | "incorrect" | "irrelevant",
  "phraseId": "the exact ID of the matching sentence if correct_reveal, empty string otherwise"
}
     `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response from the AI.
    const aiResponse = JSON.parse(responseText);

         // Now, we map the structured AI response to our desired result format.
     const status = aiResponse.status;
     const phraseId = aiResponse.phraseId;

     if (status === 'correct_reveal' && phraseId) {
       const matchedPhrase = phrases.find(p => p.id === phraseId);
       return {
         answer: 'Yes',
         explanation: matchedPhrase?.text || 'Phrase revealed',
         matchedPhraseId: phraseId,
         isPartialMatch: false,
       };
     } else if (status === 'correct_no_reveal') {
       return {
         answer: 'Yes',
         explanation: 'That statement is true but doesn\'t describe a complete sentence.',
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
     
     // Look for very strong semantic matches that would warrant phrase revelation
     for (const phrase of phrases) {
         const phraseWords = phrase.text.toLowerCase().split(' ').filter(word => word.length > 2);
         const commonWords = words.filter(word => 
             word.length > 2 && phraseWords.some(pWord => pWord.includes(word) || word.includes(pWord))
         );
         
         // Require very high similarity for phrase revelation (even stricter)
         const similarity = commonWords.length / phraseWords.length; // Must cover most of the phrase words
         if (commonWords.length >= Math.min(4, phraseWords.length) && similarity >= 0.75) {
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
         
         // Lower threshold for confirming truth without revealing phrase
         if (commonWords.length >= 1 && commonWords.length / Math.max(words.length, 3) >= 0.3) {
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
