import { StoryPhrase } from '@prisma/client';
import { evaluateQuestion as evaluateWithGemini } from './gemini';
import { QuestionEvaluationResult } from './ai-prompt';

export type AIProvider = 'gemini' | '';

// Configuration - set default provider here
const DEFAULT_AI_PROVIDER: AIProvider = 'gemini'; // Using Gemini with system instructions as default

/**
 * Get the current AI provider from environment variable or use default
 */
function getAIProvider(): AIProvider {
  const envProvider = process.env.AI_PROVIDER as AIProvider;
  return envProvider || DEFAULT_AI_PROVIDER;
}

/**
 * Simple AI provider router - routes to the selected provider
 */
export async function evaluateQuestion(
  question: string,
  phrases: StoryPhrase[],
  context: string
): Promise<QuestionEvaluationResult> {
  const provider = getAIProvider();
  
  console.log(`🤖 Using AI Provider: ${provider.toUpperCase()}`);
  
  switch (provider) {
    case 'gemini':
      return await evaluateWithGemini(question, phrases, context);
        
    default:
      console.warn(`No provider available`);
      return {
        answer: 'Irrelevant',
        explanation: 'No provider available',
        matchedPhraseId: undefined,
        isPartialMatch: false
      }
  }
} 