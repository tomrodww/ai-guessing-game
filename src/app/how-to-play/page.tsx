import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  HelpCircle, 
  Target, 
  Lightbulb, 
  Brain, 
  Trophy,
  Clock,
  Coins,
  Eye,
  Rocket,
  Map,
  BookOpen,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Play WhaHappen - Complete Game Guide & Strategies',
  description: 'Master the art of mystery solving with our comprehensive guide to WhaHappen. Learn game mechanics, question strategies, hint systems, and advanced techniques to become a master detective.',
  keywords: 'how to play WhaHappen, game guide, mystery solving strategies, detective game tips, AI game tutorial, question strategies, hint system, game mechanics',
}

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-background-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            How to Play <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">WhaHappen</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master the art of mystery solving with our comprehensive guide. Learn the game mechanics, 
            develop winning strategies, and discover advanced techniques to become a master detective.
          </p>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. Choose Your Story</h3>
              <p className="text-muted-foreground">
                Select from mystery, sci-fi, or adventure themes. Start with shorter stories if you're new to the game.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. Ask Questions</h3>
              <p className="text-muted-foreground">
                Formulate yes/no questions to uncover the mystery. Be specific and strategic in your approach.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Solve & Discover</h3>
              <p className="text-muted-foreground">
                Use AI responses and hints to piece together the story. Reveal phrases and complete the mystery.
              </p>
            </div>
          </div>
        </section>

        {/* Game Mechanics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Understanding Game Mechanics
          </h2>
          
          <div className="space-y-8">
            {/* Question System */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                The Question System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">How Questions Work</h4>
                  <p className="text-muted-foreground mb-4">
                    Every question you ask receives one of three responses from our AI system:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-foreground font-medium">Yes</span>
                      <span className="text-muted-foreground">- Your statement is correct</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-foreground font-medium">No</span>
                      <span className="text-muted-foreground">- Your statement is incorrect</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Minus className="h-5 w-5 text-yellow-500" />
                      <span className="text-foreground font-medium">Irrelevant</span>
                      <span className="text-muted-foreground">- Not related to the mystery</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Question Types</h4>
                  <div className="space-y-3">
                    <div className="bg-background p-3 rounded border">
                      <p className="text-sm text-muted-foreground mb-1">Factual Questions</p>
                      <p className="text-foreground">"Is the victim a woman?"</p>
                    </div>
                    <div className="bg-background p-3 rounded border">
                      <p className="text-sm text-muted-foreground mb-1">Relationship Questions</p>
                      <p className="text-foreground">"Are the suspect and victim related?"</p>
                    </div>
                    <div className="bg-background p-3 rounded border">
                      <p className="text-sm text-muted-foreground mb-1">Location Questions</p>
                      <p className="text-foreground">"Did the crime happen at night?"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint System */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-primary" />
                The Hint System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">How Hints Work</h4>
                  <p className="text-muted-foreground mb-4">
                    Each story comes with three strategic hints that become more revealing as you make discoveries:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Hint 1:</strong> Basic story context and setup</li>
                    <li>• <strong>Hint 2:</strong> Reveals after first discovery</li>
                    <li>• <strong>Hint 3:</strong> Most revealing after multiple discoveries</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Unlocking Hints</h4>
                  <p className="text-muted-foreground mb-4">
                    Hints unlock automatically as you progress through the story. You can also use coins to unlock hints early:
                  </p>
                  <div className="flex items-center gap-2 text-foreground">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span>Each hint costs 2 coins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coin System */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Coins className="h-6 w-6 text-primary" />
                The Coin System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Earning Coins</h4>
                  <p className="text-muted-foreground mb-4">
                    You start each game with 7 coins. Earn more by making discoveries:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-foreground">First discovery: +2 coins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-foreground">Subsequent discoveries: +1 coin each</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Spending Coins</h4>
                  <p className="text-muted-foreground mb-4">
                    Use coins strategically to enhance your gameplay:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-foreground">Unlock hints early: 2 coins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="text-foreground">Reveal phrases: 3 coins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Strategies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Advanced Strategies & Techniques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Question Strategy */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                Question Strategy
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Start Broad, Then Narrow</h4>
                  <p className="text-muted-foreground text-sm">
                    Begin with general questions about the story context, then focus on specific details as you gather information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Use Binary Logic</h4>
                  <p className="text-muted-foreground text-sm">
                    Frame questions that can only be answered with yes/no to maximize information gain from each question.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Build on Previous Answers</h4>
                  <p className="text-muted-foreground text-sm">
                    Use information from previous questions to formulate more specific and targeted follow-up questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Time Management */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                Time Management
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Set Time Limits</h4>
                  <p className="text-muted-foreground text-sm">
                    Give yourself a reasonable time limit per question to maintain momentum and avoid overthinking.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Track Progress</h4>
                  <p className="text-muted-foreground text-sm">
                    Monitor your discoveries and remaining phrases to gauge how close you are to solving the mystery.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Know When to Use Hints</h4>
                  <p className="text-muted-foreground text-sm">
                    Don't hesitate to use hints if you're stuck. They're designed to help you progress, not cheat.
                  </p>
                </div>
              </div>
            </div>

            {/* Theme-Specific Tips */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                Mystery Theme Tips
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Focus on Motives</h4>
                  <p className="text-muted-foreground text-sm">
                    Ask about relationships, alibis, and motives. Mystery stories often revolve around human psychology.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Timeline Questions</h4>
                  <p className="text-muted-foreground text-sm">
                    Establish when events occurred and in what order. Timing is crucial in mystery solving.
                  </p>
                </div>
              </div>
            </div>

            {/* Sci-Fi Tips */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                <Rocket className="h-5 w-5 text-primary" />
                Sci-Fi Theme Tips
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Technology Focus</h4>
                  <p className="text-muted-foreground text-sm">
                    Ask about futuristic technology, scientific principles, and how they affect the story's events.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">World-Building</h4>
                  <p className="text-muted-foreground text-sm">
                    Understand the rules of the sci-fi universe before diving into specific plot details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Common Mistakes to Avoid
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Asking Vague Questions</h3>
                  <p className="text-muted-foreground">
                    Questions like "Is there something important?" are too vague and won't provide useful information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ignoring Context</h3>
                  <p className="text-muted-foreground">
                    Don't skip the story context and hints. They often contain crucial information for solving the mystery.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Rushing Through</h3>
                  <p className="text-muted-foreground">
                    Take time to think about each answer and how it connects to previous information before asking the next question.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Not Using Hints</h3>
                  <p className="text-muted-foreground">
                    Hints are there to help you. Don't be afraid to use them when you're stuck or want to verify your theories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Pro Tips from Expert Players
          </h2>
          
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Keep a Notes System</h4>
                    <p className="text-muted-foreground text-sm">
                      Write down important information and connections as you discover them. This helps you build a complete picture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Use Elimination Logic</h4>
                    <p className="text-muted-foreground text-sm">
                      When you get a "No" answer, use it to eliminate possibilities and narrow down your options.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Think Like a Detective</h4>
                    <p className="text-muted-foreground text-sm">
                      Approach each mystery systematically. Look for inconsistencies, patterns, and hidden connections.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Practice Makes Perfect</h4>
                    <p className="text-muted-foreground text-sm">
                      Start with shorter stories to learn the mechanics, then challenge yourself with longer, more complex mysteries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Manage Your Resources</h4>
                    <p className="text-muted-foreground text-sm">
                      Save coins for when you really need them. Sometimes it's better to think through a problem than to spend coins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Celebrate Small Wins</h4>
                    <p className="text-muted-foreground text-sm">
                      Every discovery is progress. Don't get discouraged if you can't solve the entire mystery at once.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Put Your Skills to the Test?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Now that you understand the game mechanics and strategies, it's time to start solving mysteries! 
              Choose a story that matches your experience level and begin your detective journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/">Start Playing Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More About WhaHappen</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
