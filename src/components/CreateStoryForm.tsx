'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

export function CreateStoryForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating story:', formData)
    // TODO: Implement story creation API
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Story Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Enter an engaging title for your story"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px] resize-y"
              placeholder="Describe what the story is about and what players should expect"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save className="h-4 w-4" />
          Create Story
        </button>
      </div>
    </form>
  )
}
