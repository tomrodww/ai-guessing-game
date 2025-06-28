import { Sparkles } from "lucide-react";
import { StoryCard } from "./StoryCard";
import { StoryFilters } from "./StoryFilters";
import { matchesDifficultyFilter } from "@/lib/difficulty";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "./ui/button";

export async function StorySelection({ searchParams }: { searchParams: { theme?: string; difficulty?: string } }) {
  const resolvedSearchParams = searchParams
  
  // Get unique themes from stories
  const uniqueThemes = await prisma.story.findMany({
    where: { isActive: true },
    select: { theme: true },
    distinct: ['theme'],
    orderBy: { theme: 'asc' }
  })
  
  const themes = uniqueThemes.map(story => story.theme)

  // Build where clause for filtering
  const where: any = {
    isActive: true
  }

  if (resolvedSearchParams.theme) {
    where.theme = resolvedSearchParams.theme
  }

  // Fetch stories (we'll filter by difficulty on the client side)
  let stories = await prisma.story.findMany({
    where,
    include: {
      phrases: {
        select: {
          id: true
        }
      }
    },
    orderBy: [
      { theme: 'asc' },
      { title: 'asc' }
    ]
  })

  // Filter by difficulty using the centralized difficulty system
  if (resolvedSearchParams.difficulty) {
    stories = stories.filter(story => 
      matchesDifficultyFilter(story.phrases.length, resolvedSearchParams.difficulty!)
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-8 max-w-7xl mx-auto">
        <StoryFilters
          themes={themes}
          selectedTheme={resolvedSearchParams.theme}
          selectedDifficulty={resolvedSearchParams.difficulty}
        />
      </div>

      {/* Stories Grid */}
      {stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <StoryCard story={story} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-muted-foreground mb-4">
              <Sparkles className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No stories found
            </h3>
            <Button asChild>
              <Link href="/">Clear Filters</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
} 