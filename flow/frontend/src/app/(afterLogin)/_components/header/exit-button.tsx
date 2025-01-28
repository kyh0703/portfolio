'use client'

import { Button } from '@/app/_components/button'
import { DarkExitIcon, ExitIcon } from '@/app/_components/icon'

export default function ExitButton() {
  const handleClick = () => {
    window.close()
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleClick}>
      <DarkExitIcon className="dark-icon" width={32} height={32} />
      <ExitIcon className="light-icon" width={32} height={32} />
    </Button>
  )
}
