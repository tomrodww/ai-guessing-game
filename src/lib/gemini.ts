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
  phrases: StoryPhrase[],
  context: string
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

Context:
${context}

Story Phrases:
${phrases.map((phrase) => `"${phrase.text}"`).join('\n')}

STEP 1 - BASIC VERIFICATION:
Determine if the player's statement combined with the context is:
- "correct": The statement is true based on one or more of the story phrases (consider equivalent meanings)
- "incorrect": The statement contradicts the story phrases  
- "irrelevant": The statement cannot be determined true or false from the story phrases

consider the context when evaluating the player's statement. The user already has access to the context at the start of the game. Any information that is not related to the context or the phrases, is not relevant to the player's statement.

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
You are doing DEEP ANALYSIS for phrase revelation in the mystery guessing game.

The player's statement has been verified as CORRECT. Now determine if it should reveal a specific phrase.

Story Phrases:
${phrases.map((phrase) => `ID: ${phrase.id} - "${phrase.text}"`).join('\n')}

STEP 2 - PHRASE REVELATION ANALYSIS:

Important: Combine the context with the player's statement and compare it to the phrases.

RULES FOR REVELATION:
1. The player must describe the main idea of a specific phrase (consider equivalent meanings)
2. The statement must capture the main idea of the phrase (consider equivalent meanings)
3. Accept words with similar meaning, like 'putting out a fire' and 'fighting a fire', as long as the main idea is the same (consider equivalent meanings)
4. Check the Phrase and see if any important information was missed in the player's statement (combined with the context) (consider equivalent meanings)
5. The context is also part of the players statement. the context should be combined with the statement before comparing it to the phrases.

ANALYSIS PROCESS:
For each phrase, identify its main idea and key elements and check if they are present in the player's statement.

Example Analysis:
Phrase: "A helicopter was fighting the fire"
Key elements: HELICOPTER + FIGHTING + FIRE
- Player: "there was a fire" → Missing: HELICOPTER(or similar words), FIGHTING (or similar words) → NO REVEAL
- Player: "helicopter was fighting fire" → All elements present → REVEAL
- Player: "helicopter was combating fire" → All elements present → REVEAL

Example Analysis:
Phrase: "One survivor was a doctor"
- Player: "the survivor was a doctor" → All elements present → REVEAL
- Player: "the survivor was a surgeon" → All elements present → REVEAL
- Player: "one of them was a doctor" → All elements present → REVEAL
- Player: "there was a doctor" → All elements present → REVEAL

Example Analysis:
Phrase: "The helicopter used lake water"  
Key elements: HELICOPTER + USED + LAKE + WATER
- Player: "there was a lake" → Missing: HELICOPTER(or similar words), USED(or similar words), WATER(or similar words) → NO REVEAL
- Player: "helicopter got water from lake" → All elements present → REVEAL

Example Analysis:
Context: 'A month after a shipwreck, four survivors are found on an island. Two have one arm missing, one is missing an arm and a leg, and the fourth is whole. Why?'
Phrase: "One survivor was missing an arm and a leg"
- Player: "one was missing an arm" → Missing: LEG(or similar words) → NO REVEAL
- Player: "one was missing an arm and a leg" → All elements present → REVEAL (even though the word 'survivor' is not mentioned, the context is mentioning that there are survivors)
- Player: "one of them was missing an arm" → Missing: LEG(or similar words) → NO REVEAL

Player Statement: "${affirmation}"

Analyze the player's statement combined with the context and compare it to the phrases.

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
