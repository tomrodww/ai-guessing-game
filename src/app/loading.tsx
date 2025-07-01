import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <Loader2 className='animate-spin text-primary h-12 w-12' />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
} 