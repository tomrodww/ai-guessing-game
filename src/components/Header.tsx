'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/'
    }
  ]

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/wha-happen.svg" alt="WhaHappen?" width={200} height={200} className='mt-2'/>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.href}
                    variant={item.isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}