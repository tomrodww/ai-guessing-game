'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Home, Plus, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      href: '/create',
      label: 'Create Story',
      icon: Plus,
      isActive: pathname === '/create'
    },
    {
      href: '/about',
      label: 'About',
      icon: Info,
      isActive: pathname === '/about'
    }
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                AI Guessing Game
              </h1>
              <p className="text-xs text-gray-500 leading-none">
                Uncover the mystery
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    item.isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}