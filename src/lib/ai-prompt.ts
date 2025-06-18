import { StoryPhrase } from '@prisma/client';

// Debug mode - set to false to reduce console logs
const DEBUG_AI = true;

/**
 * Generates the unified AI prompt for evaluating player statements
 * This prompt is used by both Gemini and DeepSeek for consistency
 */
export function generateAIPrompt(
  affirmation: string,
  phrases: StoryPhrase[],
  context: string
): string {
  if (DEBUG_AI) {
    console.log('📝 Generating AI Prompt for:', {
      playerStatement: affirmation,
      phraseCount: phrases.length,
      contextLength: context.length
    });
    
    // Log the exact phrases being sent to AI
    console.log('📋 Phrases being sent to AI:');
    phrases.forEach((phrase, index) => {
      console.log(`  ${index + 1}. PHRASE_ID: "${phrase.id}" | TEXT: "${phrase.text}"`);
    });
  }
  
  const prompt = `
    You are Game Master AI for a mystery guessing game. Your task is to analyze a player's statement and return a single JSON object that summarizes your complete analysis.

    ---
    ## GAME DATA - This is the truth, you must not lie ##

    1.  **Overall Context (Already known by the player):**
        ${context}

    2.  **Secret Story Phrases (The player must guess these):**
        ${phrases.map((phrase, index) => ` PHRASE_ID: "${phrase.id}" | TEXT: "${phrase.text}"`).join('\n        ')}

    ---
    ## PLAYER'S STATEMENT TO ANALYZE - This is the player's statement, you must not lie ##
    "${affirmation}"

    VERY IMPORTANT: The player knows the context, so you must consider the Context with the players statement to make a complete thought.

    ---
    ## YOUR ANALYSIS PROCESS (Follow these steps) - You must not lie ##

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

    **CRITICAL: If you decide to reveal a phrase, you MUST use the EXACT PHRASE_ID from the list above (the unique identifier string, in the "2.**Secret Story Phrases (The player must guess these):**").**

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

    ---
    ## REQUIRED JSON OUTPUT ##
    Respond with ONLY the following JSON object. Do not add any text before or after it.

    IMPORTANT: If shouldReveal is true, use the exact PHRASE_ID (the unique identifier string) and exact TEXT from the list above. If shouldReveal is false, use empty string for phraseId and phraseText.

    {
      "status": "correct" | "incorrect" | "irrelevant",
      "shouldReveal": true | false,
      "phraseId": "PHRASE_ID",
      "phraseText": "TEXT",
      "reasoning": "A brief explanation for your decision."
    }
  `;
  
  if (DEBUG_AI) {
    console.log('📤 Full prompt being sent to AI:');
    console.log(prompt);
  }
  
  return prompt;
}

/**
 * Interface for the expected AI response format
 */
export interface AIPromptResponse {
  status: 'correct' | 'incorrect' | 'irrelevant';
  shouldReveal: boolean;
  phraseId: string;
  phraseText: string;
  reasoning: string;
}

/**
 * Interface for the final evaluation result
 */
export interface AffirmationEvaluationResult {
  answer: 'Yes' | 'No' | 'Irrelevant';
  explanation?: string;
  matchedPhraseId?: string;
  isPartialMatch?: boolean;
}

/**
 * Processes the AI response and converts it to the standard evaluation result format
 */
export function processAIResponse(
  aiResponse: AIPromptResponse,
  phrases: StoryPhrase[],
  playerStatement?: string
): AffirmationEvaluationResult {
  // Log the AI's raw response for debugging
  if (DEBUG_AI) {
    console.log('🤖 AI Raw Response:', {
      playerStatement: playerStatement || 'N/A',
      aiResponse: aiResponse,
      timestamp: new Date().toISOString()
    });
  }
  let finalResult: AffirmationEvaluationResult;

  if (aiResponse.status === 'correct') {
    if (aiResponse.shouldReveal && aiResponse.phraseId) {
      // Find phrase by ID
      let matchedPhrase = phrases.find(p => p.id === aiResponse.phraseId);
      
      // If still no match, try to find by reasoning content (fallback)
      if (!matchedPhrase && aiResponse.reasoning) {
        // Look for phrases mentioned in the AI's reasoning
        const reasoningLower = aiResponse.reasoning.toLowerCase();
        matchedPhrase = phrases.find(p => {
          const textLower = p.text.toLowerCase();
          // Check if the phrase text appears in the reasoning
          return reasoningLower.includes(textLower) || 
                 textLower.includes(reasoningLower.split(' ').slice(-5).join(' '));
        });
        
        if (matchedPhrase && DEBUG_AI) {
          console.log('🔄 Found phrase by reasoning fallback:', matchedPhrase.text);
        }
      }
      
      // Debug the phrase lookup
      if (DEBUG_AI) {
        console.log('🔍 Phrase Lookup Debug:', {
          searchingForId: aiResponse.phraseId,
          totalPhrases: phrases.length,
          availablePhrases: phrases.map((p) => ({ 
            id: p.id,
            text: p.text 
          })),
          foundPhrase: matchedPhrase,
          foundByReasoning: matchedPhrase && aiResponse.phraseId !== matchedPhrase.id
        });
      }
      
      finalResult = {
        answer: 'Yes',
        explanation: matchedPhrase?.text || 'A new clue has been revealed!',
        matchedPhraseId: matchedPhrase?.id, // Use the actual database ID
        isPartialMatch: false,
      };
      if (DEBUG_AI) console.log('✅ PHRASE REVEALED:', matchedPhrase?.text);
    } else {
      // The statement is true, but not enough to reveal a full phrase.
      finalResult = {
        answer: 'Yes',
        explanation: 'That is true, but it doesn\'t reveal a full clue. Be more specific!',
        isPartialMatch: true, // This flag is useful for the UI
      };
      if (DEBUG_AI) console.log('⚠️ PARTIAL MATCH: Statement correct but not specific enough');
    }
  } else if (aiResponse.status === 'incorrect') {
    finalResult = {
      answer: 'No',
      explanation: 'That statement is incorrect.',
      isPartialMatch: false,
    };
    if (DEBUG_AI) console.log('❌ INCORRECT: Statement contradicts the story');
  } else { // 'irrelevant'
    finalResult = {
      answer: 'Irrelevant',
      explanation: 'That statement is irrelevant to the story.',
      isPartialMatch: false,
    };
    if (DEBUG_AI) console.log('🚫 IRRELEVANT: Statement not related to story');
  }

  if (DEBUG_AI) console.log('🎮 Final Game Response:', finalResult);
  return finalResult;
} 