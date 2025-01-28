'use client'

import { MoonIcon, SunIcon } from '@/app/_components/icon'
import { useTheme } from 'next-themes'
import type { MouseEventHandler } from 'react'
import { Button } from '../../../_components/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleClick}>
      <MoonIcon className="light-icon" />
      <SunIcon className="dark-icon" />
    </Button>
  )
}
