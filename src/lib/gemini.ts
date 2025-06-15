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
You are the Game Master for a mystery guessing game. Players make statements, and you must decide whether to reveal story phrases.

Story Phrases:
${phrases.map((phrase) => `ID: ${phrase.id} - "${phrase.text}"`).join('\n')}

PHRASE REVELATION RULES - BE EXTREMELY STRICT:

1. ONLY reveal a phrase if the player's statement contains ALL major elements of that exact phrase
2. Each phrase has MULTIPLE key elements - the player must mention ALL of them
3. If ANY key element is missing, DO NOT reveal the phrase, even if other elements are correct

DETAILED ANALYSIS PROCESS:
For each phrase, identify ALL key elements (nouns, verbs, important descriptors):

Example: "A helicopter was fighting the fire"
- Key elements: HELICOPTER + FIGHTING + FIRE
- Player says "there was a fire" → Missing HELICOPTER and FIGHTING → NO REVEAL
- Player says "there was a helicopter" → Missing FIRE and FIGHTING → NO REVEAL  
- Player says "something was fighting the fire" → Missing HELICOPTER → NO REVEAL
- Player says "a helicopter was fighting a fire" → ALL elements present → REVEAL

Example: "The helicopter used lake water"
- Key elements: HELICOPTER + USED + LAKE + WATER
- Player says "there was a lake" → Missing HELICOPTER, USED, WATER → NO REVEAL
- Player says "there was water" → Missing HELICOPTER, USED, LAKE → NO REVEAL
- Player says "helicopter used water" → Missing LAKE → NO REVEAL
- Player says "helicopter got water from lake" → ALL elements present → REVEAL

COMMON MISTAKES TO AVOID:
❌ Don't reveal based on single words or partial concepts
❌ Don't reveal based on logical connections or implications
❌ Don't reveal if the statement is "close enough" - it must be complete
❌ Don't reveal if you can infer the missing elements - they must be stated

RESPONSE GUIDELINES:
- "correct_reveal": Player mentioned ALL key elements of a specific phrase
- "correct_no_reveal": Player's statement is true but incomplete (missing key elements)
- "incorrect": Player's statement contradicts the story
- "irrelevant": Player's statement cannot be determined from the story

BE CONSERVATIVE: When in doubt, choose "correct_no_reveal" rather than "correct_reveal"

Player Statement: "${affirmation}"

Analyze each phrase systematically:
1. List the key elements of each phrase
2. Check if the player's statement contains ALL key elements
3. Only reveal if 100% of key elements are present

Respond with JSON:
{
  "status": "correct_reveal" | "correct_no_reveal" | "incorrect" | "irrelevant",
  "phraseId": "the exact ID if correct_reveal, empty string otherwise"
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
     
     // Look for EXTREMELY strong semantic matches that would warrant phrase revelation
     // This should be very rare and require almost exact matches
     for (const phrase of phrases) {
         const phraseWords = phrase.text.toLowerCase().split(' ').filter(word => word.length > 2);
         const commonWords = words.filter(word => 
             word.length > 2 && phraseWords.some(pWord => pWord.includes(word) || word.includes(pWord))
         );
         
         // Require almost perfect match for phrase revelation (extremely strict)
         const similarity = commonWords.length / phraseWords.length;
         // Need at least 80% of phrase words AND minimum 4 common words
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
     // This should be the most common case
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
