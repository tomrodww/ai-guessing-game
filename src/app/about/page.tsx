import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Puzzle, 
  Users, 
  BookOpen, 
  Target, 
  Trophy,
  Lightbulb,
  Shield,
  Zap,
  Gamepad2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About WhaHappen - AI-Powered Mystery Solving Game',
  description: 'Discover how WhaHappen combines artificial intelligence with interactive storytelling to create engaging mystery-solving experiences. Learn about our game mechanics, educational benefits, and the technology behind the scenes.',
  keywords: 'AI game, mystery solving, educational gaming, interactive storytelling, cognitive development, problem solving, detective games, brain training',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">WhaHappen</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            WhaHappen is an innovative AI-powered mystery-solving game that combines cutting-edge artificial intelligence 
            with interactive storytelling to create engaging, educational experiences for players of all ages.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that learning should be engaging, interactive, and fun. By combining AI technology with 
              compelling narratives, we create experiences that not only entertain but also develop critical thinking, 
              problem-solving skills, and logical reasoning abilities. Our goal is to make cognitive development 
              accessible to everyone through the power of storytelling and artificial intelligence.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            How WhaHappen Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Story Selection</h3>
              <p className="text-muted-foreground">
                Choose from a diverse collection of mystery stories across multiple themes including detective 
                mysteries, sci-fi adventures, and thrilling quests. Each story is carefully crafted to provide 
                unique challenges and engaging narratives.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Gameplay</h3>
              <p className="text-muted-foreground">
                Our advanced AI system evaluates your questions and provides intelligent responses, guiding you 
                through the mystery while adapting to your unique approach. The AI learns from your questions 
                to provide increasingly relevant hints and guidance.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Puzzle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Progressive Discovery</h3>
              <p className="text-muted-foreground">
                Uncover the story piece by piece through strategic questioning and careful observation. Each 
                discovery reveals new information and updates your available hints, creating a dynamic and 
                engaging progression system.
              </p>
            </div>
          </div>
        </section>

        {/* Educational Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Educational Benefits & Cognitive Development
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Critical Thinking</h4>
                  <p className="text-muted-foreground">
                    Develop logical reasoning skills by formulating strategic questions and analyzing AI responses 
                    to uncover hidden information and solve complex mysteries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Problem Solving</h4>
                  <p className="text-muted-foreground">
                    Learn to approach complex problems systematically, breaking them down into manageable 
                    questions and using available information effectively.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Communication Skills</h4>
                  <p className="text-muted-foreground">
                    Improve your ability to ask clear, specific questions and interpret responses, enhancing 
                    both written and verbal communication abilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Pattern Recognition</h4>
                  <p className="text-muted-foreground">
                    Identify connections between different pieces of information and recognize patterns that 
                    lead to solving the mystery, improving analytical thinking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Adaptive Learning</h4>
                  <p className="text-muted-foreground">
                    Experience personalized learning as the AI adapts to your skill level and provides 
                    appropriate challenges and support throughout your journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Achievement & Motivation</h4>
                  <p className="text-muted-foreground">
                    Stay motivated through our reward system, earning coins and unlocking hints as you progress, 
                    creating a sense of accomplishment and encouraging continued learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Technology & Innovation
          </h2>
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Advanced AI Integration
                </h3>
                <p className="text-muted-foreground mb-4">
                  WhaHappen leverages cutting-edge artificial intelligence powered by Google's Gemini API to 
                  provide intelligent, context-aware responses to player questions. Our AI system understands 
                  the nuances of language and can provide helpful guidance while maintaining the mystery and 
                  challenge of each story.
                </p>
                <p className="text-muted-foreground">
                  The AI continuously learns from player interactions, improving its ability to provide relevant 
                  hints and maintain engaging gameplay experiences across different difficulty levels and story themes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  Modern Web Technologies
                </h3>
                <p className="text-muted-foreground mb-4">
                  Built with Next.js 15 and React 19, WhaHappen delivers a fast, responsive, and engaging 
                  user experience across all devices. Our progressive web application ensures smooth gameplay 
                  whether you're on a desktop, tablet, or mobile device.
                </p>
                <p className="text-muted-foreground">
                  The application features real-time updates, seamless navigation, and an intuitive interface 
                  designed to enhance the mystery-solving experience without technical distractions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Start Your Mystery-Solving Journey?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of players who are already developing their critical thinking skills and 
              enjoying engaging mysteries with WhaHappen. Start with a simple story or dive into complex 
              challenges - the choice is yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/">Start Playing Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/how-to-play">Learn How to Play</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
