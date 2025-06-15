'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/wha-happen-dark.svg" alt="WhaHappen?" width={200} height={200} className='mt-2'/>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            
            <Link href="/" className="flex items-center gap-2 align-baseline justify-baseline mb-0 py-2 hover:scale-105 transition-all duration-300">
              <span className='text-medium font-medium align-baseline justify-baseline'>Home</span>
            </Link>
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