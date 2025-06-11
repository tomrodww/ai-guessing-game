import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { CreateStoryForm } from '@/components/CreateStoryForm'

export const metadata: Metadata = {
  title: 'Create New Story - AI Guessing Game',
  description: 'Create a new interactive mystery story for others to solve',
}

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create a New Story
            </h1>
            <p className="text-xl text-gray-600">
              Design an interactive mystery for other players to solve
            </p>
          </div>

          <CreateStoryForm />
        </div>
      </main>
    </div>
  )
} 