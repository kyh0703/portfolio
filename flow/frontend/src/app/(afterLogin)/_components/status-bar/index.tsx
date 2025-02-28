import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function StatusBar() {
  return (
    <div className="flex h-6 items-center justify-end gap-2 border-t bg-background px-2 text-xs text-foreground">
      <div className="flex items-center space-x-2">
        <Link href="/manuals" target="_blank" rel="noopener noreferrer">
          <div className="flex rounded-sm border">
            <div className="flex w-3 items-center justify-center rounded-l-sm bg-primary">
              <ExternalLink size={8} className="text-border" />
            </div>
            <div className="px-2">Manuals</div>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <span>Copyright (C) portfolio, All Rights Reserved.</span>
      </div>
    </div>
  )
}
