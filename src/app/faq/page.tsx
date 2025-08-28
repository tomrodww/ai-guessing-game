import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  Gamepad2, 
  Brain, 
  Coins, 
  Lightbulb, 
  Target,
  Users,
  Clock,
  Shield,
  Zap,
  BookOpen,
  MessageCircle,
  Star,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - WhaHappen Game Guide',
  description: 'Find answers to common questions about WhaHappen, the AI-powered mystery-solving game. Learn about gameplay, features, technical requirements, and more.',
  keywords: 'WhaHappen FAQ, game questions, mystery solving help, AI game support, gameplay guide, technical support',
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about WhaHappen. Can't find what you're looking for? 
            Feel free to reach out to us for additional support.
          </p>
        </header>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {/* Gameplay Questions */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Gamepad2 className="h-6 w-6 text-primary" />
              Gameplay & Mechanics
            </h2>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How does WhaHappen work?
                </h3>
                <p className="text-muted-foreground mb-3">
                  WhaHappen is an AI-powered mystery-solving game where you ask yes/no questions to uncover hidden stories. 
                  Each story is divided into phrases that you discover through strategic questioning. The AI evaluates your 
                  questions and provides intelligent responses to guide you toward solving the mystery.
                </p>
                <p className="text-muted-foreground">
                  You start with 7 coins and can earn more by making discoveries. Use coins to unlock hints early or 
                  reveal phrases when you're stuck. The goal is to uncover all the story phrases using as few questions as possible.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What types of questions should I ask?
                </h3>
                <p className="text-muted-foreground mb-3">
                  Ask specific, yes/no questions that can help you narrow down the mystery. Good questions focus on:
                </p>
                <ul className="text-muted-foreground space-y-2 mb-3">
                  <li>• <strong>Characters:</strong> "Is the victim a woman?" "Are the suspect and victim related?"</li>
                  <li>• <strong>Timing:</strong> "Did the crime happen at night?" "Was it during the weekend?"</li>
                  <li>• <strong>Location:</strong> "Did it happen indoors?" "Was it in a public place?"</li>
                  <li>• <strong>Motives:</strong> "Was money involved?" "Was it revenge?"</li>
                </ul>
                <p className="text-muted-foreground">
                  Avoid vague questions like "Is there something important?" as they won't provide useful information.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How do I know if I'm making progress?
                </h3>
                <p className="text-muted-foreground">
                  Progress is tracked through several indicators: the number of phrases you've discovered, the hints that 
                  become available as you progress, and the coins you earn from discoveries. The AI responses also become 
                  more helpful as you gather more information, guiding you toward the solution.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What happens when I run out of coins?
                </h3>
                <p className="text-muted-foreground">
                  You can still play the game without coins, but you'll need to rely on your own deduction skills. 
                  Coins are primarily used for convenience features like early hint access and phrase reveals. 
                  You can always earn more coins by making new discoveries in the story.
                </p>
              </div>
            </div>
          </section>

          {/* AI & Technology */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              AI & Technology
            </h2>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How does the AI understand my questions?
                </h3>
                <p className="text-muted-foreground">
                  Our AI system uses advanced Natural Language Processing (NLP) to understand the context and meaning 
                  of your questions. It can interpret various ways of phrasing the same question and provide consistent, 
                  helpful responses. The AI also learns from your questioning patterns to provide increasingly relevant guidance.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Does the AI remember my previous questions?
                </h3>
                <p className="text-muted-foreground">
                  Yes, the AI maintains context throughout your game session. It remembers your previous questions and 
                  answers, allowing it to provide more relevant responses and avoid contradicting itself. This creates 
                  a coherent and engaging mystery-solving experience.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How does the AI adapt to my skill level?
                </h3>
                <p className="text-muted-foreground">
                  The AI analyzes your questioning strategy, response time, and success rate to understand your skill level. 
                  It then adjusts the difficulty of hints and guidance accordingly. Beginners receive more helpful responses, 
                  while experienced players get more challenging and subtle clues.
                </p>
              </div>
            </div>
          </section>

          {/* Stories & Content */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              Stories & Content
            </h2>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How many stories are available?
                </h3>
                <p className="text-muted-foreground">
                  We currently offer a growing collection of stories across three themes: Mystery, Sci-Fi, and Adventure. 
                  Each story is carefully crafted to provide unique challenges and engaging narratives. New stories are 
                  regularly added to keep the content fresh and exciting.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What are the different difficulty levels?
                </h3>
                <p className="text-muted-foreground mb-3">
                  Stories are categorized by difficulty based on the number of phrases and complexity:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Short (Easy):</strong> 3-5 phrases, perfect for beginners</li>
                  <li>• <strong>Medium:</strong> 6-8 phrases, balanced challenge for most players</li>
                  <li>• <strong>Long (Hard):</strong> 9+ phrases, complex mysteries for experienced players</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Can I replay the same story?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can replay any story multiple times. While the core mystery remains the same, the AI responses 
                  may vary slightly based on your questioning approach. This allows you to try different strategies and 
                  improve your mystery-solving skills.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Support */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              Technical Support
            </h2>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What devices and browsers are supported?
                </h3>
                <p className="text-muted-foreground">
                  WhaHappen works on all modern devices and browsers. We support desktop computers, tablets, and mobile 
                  phones. The game is optimized for Chrome, Firefox, Safari, and Edge browsers. For the best experience, 
                  we recommend using the latest version of your preferred browser.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Do I need to create an account to play?
                </h3>
                <p className="text-muted-foreground">
                  No account creation is required to play WhaHappen. You can start playing immediately by selecting a story. 
                  However, creating an account allows you to save your progress, track your statistics, and compete on leaderboards.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Is my progress saved?
                </h3>
                <p className="text-muted-foreground">
                  Your progress is automatically saved in your browser's local storage, so you can continue where you left off 
                  even if you close the browser. For permanent progress tracking across devices, we recommend creating an account.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What if I encounter technical issues?
                </h3>
                <p className="text-muted-foreground">
                  If you experience any technical problems, try refreshing the page or clearing your browser cache. 
                  For persistent issues, please contact our support team with details about your device, browser, and 
                  the specific problem you're encountering.
                </p>
              </div>
            </div>
          </section>

          {/* Educational Benefits */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Educational Benefits
            </h2>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What skills does WhaHappen help develop?
                </h3>
                <p className="text-muted-foreground mb-3">
                  WhaHappen is designed to develop several key cognitive and analytical skills:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Critical Thinking:</strong> Analyzing information and forming logical conclusions</li>
                  <li>• <strong>Problem Solving:</strong> Breaking down complex mysteries into manageable parts</li>
                  <li>• <strong>Logical Reasoning:</strong> Using evidence to support theories and eliminate possibilities</li>
                  <li>• <strong>Communication:</strong> Formulating clear, specific questions</li>
                  <li>• <strong>Pattern Recognition:</strong> Identifying connections between different pieces of information</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Is WhaHappen suitable for educational use?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! WhaHappen is an excellent tool for educational environments. Teachers can use it to develop 
                  students' critical thinking skills, encourage logical reasoning, and make learning engaging and interactive. 
                  The game adapts to different skill levels, making it suitable for various age groups and learning abilities.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  How does the difficulty adaptation work?
                </h3>
                <p className="text-muted-foreground">
                  The AI continuously monitors your performance and adjusts the challenge level accordingly. If you're 
                  struggling, it provides more helpful hints and guidance. If you're progressing quickly, it increases 
                  the challenge to keep you engaged. This ensures that every player has an optimal learning experience.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Privacy & Security
            </h2>
            
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What data does WhaHappen collect?
                </h3>
                <p className="text-muted-foreground">
                  We collect minimal data necessary to provide the gaming experience. This includes your questions, 
                  the AI responses, and basic gameplay statistics. We do not collect personal information unless you 
                  choose to create an account. All data is handled securely and in accordance with privacy best practices.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Is my gameplay data shared with third parties?
                </h3>
                <p className="text-muted-foreground">
                  No, your gameplay data is not shared with third parties. We use the data internally to improve 
                  the AI system and enhance the gaming experience. Any analytics are anonymized and used solely for 
                  product development purposes.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Still Have Questions */}
        <section className="mt-16 text-center">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Check out our comprehensive guides or reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/how-to-play">Read How to Play Guide</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More About WhaHappen</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Related Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/how-to-play" className="group">
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Complete How to Play Guide
                </h3>
                <p className="text-muted-foreground text-sm">
                  Master the game mechanics, learn advanced strategies, and discover pro tips to become a mystery-solving expert.
                </p>
                <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
                  <span>Read Guide</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/blog/ai-gaming-revolution" className="group">
              <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  AI Gaming Revolution Blog
                </h3>
                <p className="text-muted-foreground text-sm">
                  Explore how artificial intelligence is transforming gaming and learn about the technology behind WhaHappen.
                </p>
                <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
