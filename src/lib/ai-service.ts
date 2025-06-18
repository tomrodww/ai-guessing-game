import { StoryPhrase } from '@prisma/client';
import { evaluateAffirmation as evaluateWithGemini } from './gemini';
import { evaluateAffirmationWithDeepSeek } from './deepseek';
import { AffirmationEvaluationResult } from './ai-prompt';

export type AIProvider = 'gemini' | 'deepseek';

// Configuration - set default provider here
const DEFAULT_AI_PROVIDER: AIProvider = 'deepseek'; // Using Deepseek as default

/**
 * Get the current AI provider from environment variable or use default
 */
function getAIProvider(): AIProvider {
  const envProvider = process.env.AI_PROVIDER as AIProvider;
  return envProvider || DEFAULT_AI_PROVIDER;
}

/**
 * Unified AI evaluation function that routes to the appropriate provider
 * @param affirmation The player's statement
 * @param phrases Array of story phrase objects
 * @param context The story context
 * @param provider Optional provider override
 * @returns Evaluation result
 */
export async function evaluateAffirmation(
  affirmation: string,
  phrases: StoryPhrase[],
  context: string,
  provider?: AIProvider
): Promise<AffirmationEvaluationResult> {
  const selectedProvider = provider || getAIProvider();
  
  console.log(`🤖 Using AI Provider: ${selectedProvider.toUpperCase()}`);
  
  try {
    switch (selectedProvider) {
      case 'deepseek':
        return await evaluateAffirmationWithDeepSeek(affirmation, phrases, context);
      
      case 'gemini':
        return await evaluateWithGemini(affirmation, phrases, context);
      
      default:
        console.warn(`Unknown AI provider: ${selectedProvider}, falling back to DeepSeek`);
        return await evaluateAffirmationWithDeepSeek(affirmation, phrases, context);
    }
  } catch (error) {
    console.error(`Error with ${selectedProvider} provider:`, error);
    
    // Fallback to the other provider if the primary fails
    const fallbackProvider = selectedProvider === 'deepseek' ? 'gemini' : 'deepseek';
    console.log(`🔄 Falling back to ${fallbackProvider.toUpperCase()}`);
    
    try {
      switch (fallbackProvider) {
        case 'deepseek':
          return await evaluateAffirmationWithDeepSeek(affirmation, phrases, context);
        case 'gemini':
          return await evaluateWithGemini(affirmation, phrases, context);
        default:
          throw new Error('All AI providers failed');
      }
    } catch (fallbackError) {
      console.error(`Fallback provider ${fallbackProvider} also failed:`, fallbackError);
      
      // Final fallback to simple evaluation
      return {
        answer: 'Irrelevant',
        explanation: 'AI service temporarily unavailable. Please try again.',
        isPartialMatch: false
      };
    }
  }
}

/**
 * Get available AI providers based on configured API keys
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  
  if (process.env.OPENROUTER_API_KEY) {
    providers.push('deepseek');
  }
  
  if (process.env.GEMINI_API_KEY) {
    providers.push('gemini');
  }
  
  return providers;
}

/**
 * Check if a specific AI provider is available
 */
export function isProviderAvailable(provider: AIProvider): boolean {
  const available = getAvailableProviders();
  return available.includes(provider);
}

/**
 * Quick toggle between providers (for development/testing)
 */
export function toggleProvider(): AIProvider {
  const current = getAIProvider();
  return current === 'deepseek' ? 'gemini' : 'deepseek';
} 