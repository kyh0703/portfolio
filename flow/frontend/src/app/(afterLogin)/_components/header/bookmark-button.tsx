'use client'

import { Button } from '@/app/_components/button'
import { BookmarkIcon } from 'lucide-react'
import type { MouseEventHandler } from 'react'

export default function BookmarkButton() {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    console.log('click bookmark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleClick}>
      <BookmarkIcon size={20} />
    </Button>
  )
}
