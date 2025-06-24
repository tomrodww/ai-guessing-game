'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/wha-happen-dark.svg" alt="WhaHappen?" width={160} height={160} className='mt-2'/>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </header>
  )
}