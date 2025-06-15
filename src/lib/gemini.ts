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
 * Uses a two-step verification process for better accuracy.
 * @param affirmation The player's statement.
 * @param phrases An array of story phrase objects, each with an id and text.
 * @returns An evaluation result object.
 */
export async function evaluateAffirmation(
  affirmation: string,
  phrases: StoryPhrase[]
): Promise<AffirmationEvaluationResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // STEP 1: Basic correctness verification
    const step1Prompt = `
You are evaluating a player's statement in a mystery guessing game.

Story Phrases:
${phrases.map((phrase) => `"${phrase.text}"`).join('\n')}

STEP 1 - BASIC VERIFICATION:
Determine if the player's statement is:
- "correct": The statement is true based on one or more of the story phrases (consider equivalent meanings)
- "incorrect": The statement contradicts the story phrases  
- "irrelevant": The statement cannot be determined true or false from the story phrases

Player Statement: "${affirmation}"

Respond with JSON:
{
  "status": "correct" | "incorrect" | "irrelevant"
}
    `;

    const step1Result = await model.generateContent(step1Prompt);
    const step1Response = JSON.parse(step1Result.response.text());

    // If not correct, return immediately
    if (step1Response.status !== 'correct') {
      if (step1Response.status === 'incorrect') {
        return {
          answer: 'No',
          explanation: 'That statement is incorrect.',
          isPartialMatch: false,
        };
      } else {
        return {
          answer: 'Irrelevant',
          explanation: 'That statement is irrelevant to the story.',
          isPartialMatch: false,
        };
      }
    }

    // STEP 2: Deep phrase revelation analysis
    const step2Prompt = `
You are doing DEEP ANALYSIS for phrase revelation in a mystery guessing game.

The player's statement has been verified as CORRECT. Now determine if it should reveal a specific phrase.

Story Phrases:
${phrases.map((phrase) => `ID: ${phrase.id} - "${phrase.text}"`).join('\n')}

STEP 2 - PHRASE REVELATION ANALYSIS:

STRICT RULES FOR REVELATION:
1. The player must mention ALL key elements of a specific phrase
2. Key elements = main nouns, verbs, and important descriptors
3. If ANY key element is missing, DO NOT reveal the phrase
4. The statement must capture the COMPLETE MEANING of the phrase
5. Accept words with similar meaning, like 'putting out a fire' and 'fighting a fire', as long as the main idea is the same

ANALYSIS PROCESS:
For each phrase, identify its key elements and check if ALL are present in the player's statement.

Example Analysis:
Phrase: "A helicopter was fighting the fire"
Key elements: HELICOPTER + FIGHTING + FIRE
- Player: "there was a fire" → Missing: HELICOPTER, FIGHTING → NO REVEAL
- Player: "helicopter was fighting fire" → All elements present → REVEAL
- Player: "helicopter was combating fire" → All elements present → REVEAL

Example Analysis:
Phrase: "The helicopter used lake water"  
Key elements: HELICOPTER + USED + LAKE + WATER
- Player: "there was a lake" → Missing: HELICOPTER, USED, WATER → NO REVEAL
- Player: "helicopter got water from lake" → All elements present → REVEAL

BE EXTREMELY CONSERVATIVE: Only reveal if you are 100% certain ALL key elements are mentioned or the main idea is the same.

Player Statement: "${affirmation}"

Analyze systematically:
1. For each phrase, list its key elements and get the main idea
2. Check if ALL key elements or the main idea are fully described in the player's statement. considering equivalent words and meaning.
3. Only return phraseId if ALL elements are present or the main idea is the same

Respond with JSON:
{
  "shouldReveal": true | false,
  "phraseId": "exact phrase ID if shouldReveal is true, empty string otherwise",
  "reasoning": "brief explanation of your analysis"
}
    `;

    const step2Result = await model.generateContent(step2Prompt);
    const step2Response = JSON.parse(step2Result.response.text());

    // Return final result
    if (step2Response.shouldReveal && step2Response.phraseId) {
      const matchedPhrase = phrases.find(p => p.id === step2Response.phraseId);
      return {
        answer: 'Yes',
        explanation: matchedPhrase?.text || 'Phrase revealed',
        matchedPhraseId: step2Response.phraseId,
        isPartialMatch: false,
      };
    } else {
      return {
        answer: 'Yes',
        explanation: 'That statement is true but doesn\'t describe a complete sentence.',
        isPartialMatch: false,
      };
    }

  } catch (error) {
    console.error('Error evaluating affirmation with Gemini:', error);
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
