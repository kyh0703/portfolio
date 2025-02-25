'use client'

import { Button } from '@/app/_components/button'
import { BotIcon } from 'lucide-react'
import type { MouseEventHandler } from 'react'

export default function BotButton() {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    console.log('click bookmark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleClick}>
      <BotIcon size={20} />
    </Button>
  )
}
