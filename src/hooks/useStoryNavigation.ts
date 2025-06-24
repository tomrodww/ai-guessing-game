import { useState, useEffect, useCallback } from 'react'

interface StoryNavigation {
  previous: {
    id: string
    title: string
    themeName: string
  } | null
  next: {
    id: string
    title: string
    themeName: string
  } | null
  current: {
    index: number
    total: number
  }
}

interface UseStoryNavigationReturn {
  navigation: StoryNavigation | null
  isNavigating: boolean
  error: string | null
  navigateToStory: (storyId: string) => Promise<void>
}

export function useStoryNavigation(currentStoryId: string): UseStoryNavigationReturn {
  const [navigation, setNavigation] = useState<StoryNavigation | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNavigation = useCallback(async () => {
    try {
      const response = await fetch(`/api/story-navigation?storyId=${currentStoryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch navigation')
      }
      const navigationData = await response.json()
      setNavigation(navigationData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load navigation')
    }
  }, [currentStoryId])

  const navigateToStory = useCallback(async (storyId: string) => {
    try {
      setIsNavigating(true)
      setError(null)
      
      // Navigate to the new story
      window.location.href = `/story/${storyId}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Navigation failed')
    } finally {
      setIsNavigating(false)
    }
  }, [])

  // Fetch navigation on mount and when story changes
  useEffect(() => {
    if (currentStoryId) {
      fetchNavigation()
    }
  }, [currentStoryId, fetchNavigation])

  return {
    navigation,
    isNavigating,
    error,
    navigateToStory
  }
} 