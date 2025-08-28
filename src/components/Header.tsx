'use client'

import Link from 'next/link'
import { Eye, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { StoryWithDetails } from '@/types'
import { usePathname } from 'next/navigation'
import { getDifficultyName } from '@/lib/difficulty'
import { useEffect, useState } from 'react'

// Theme to icon mapping
const getThemeIcon = (theme: string) => {
  switch (theme) {
    case 'Mystery':
      return Eye
    case 'Sci-Fi':
      return Rocket
    case 'Adventure':
      return () => <Image src="/map.svg" alt="Adventure" width={20} height={20} />
    default:
      return Eye
  }
}

export function Header() {
  const pathname = usePathname()
  const [story, setStory] = useState<StoryWithDetails | null>(null)
  const [loading, setLoading] = useState(false)

  // Extract story ID from pathname
  const storyId = pathname.startsWith('/story/') ? pathname.split('/')[2] : null

  useEffect(() => {
    if (storyId) {
      setLoading(true)
      fetch(`/api/story/${storyId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStory(data.story)
          }
        })
        .catch(error => console.error('Failed to fetch story:', error))
        .finally(() => setLoading(false))
    } else {
      setStory(null)
    }
  }, [storyId])

  const totalPhrases = story?.phrases.length || 0
  const IconComponent = getThemeIcon(story?.theme || '')
  const difficultyName = getDifficultyName(totalPhrases)

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center gap-3 group">
                <Image src="/wha-happen-dark.svg" alt="WhaHappen?" width={160} height={160} className='mt-2'/>
              </Link>

              {/* Theme Icon and Story Title */}
              {pathname !== '/' && storyId && (
                <>
                  <div className="h-6 w-px bg-border mx-4" />
                
                  <div className="flex items-center space-x-3 max-md:hidden">
                    <div className="p-2 rounded-lg">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      {story?.title ? (
                        <h1 className="font-semibold text-foreground text-xl mt-1">
                          {story?.title}
                          <span className="text-sm text-muted-foreground"> • {difficultyName}</span>
                        </h1>
                      ) : (
                        <div className="h-7 w-48 bg-muted rounded animate-pulse" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            {pathname === '/' && (
            <div className="flex items-center gap-4 mt-1">
              {/* Main Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/how-to-play" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How to Play
                </Link>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <Link href="/blog/ai-gaming-revolution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </nav>

              {/* Donation Dropdown */}
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <span className="text-sm">Support this project</span>
                </Button>
                
                {/* Dropdown Content */}
                <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Help us improve and maintain this game by donating Solana</h3>   
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground text-wrap max-w-60">Solana Wallet Address: <span className='text-xs'>5PTBDWFaFDrFmtiSayNEg34ga6PKfX9PbSGz1XFQDiaD</span></label>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('5PTBDWFaFDrFmtiSayNEg34ga6PKfX9PbSGz1XFQDiaD')
                          // You could add a toast notification here
                        }}
                        className="w-full p-2 bg-muted border border-border rounded text-xs font-mono text-foreground hover:bg-muted/80 transition-colors break-all"
                        title="Click to copy wallet address"
                      >
                        Copy Wallet Address
                      </button>
                      <p className="text-xs text-muted-foreground">
                        Any amount appreciated 🙏
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
    </header>
  )
}