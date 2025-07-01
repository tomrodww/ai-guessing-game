import { StoryPhrase } from '@prisma/client';

// Debug mode - set to false to reduce console logs (now using optimized prompts with system instructions)
const DEBUG_AI = false;


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