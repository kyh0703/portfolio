'use client'

import { MoonIcon, SunIcon } from '@/app/_components/icon'
import { useTheme } from 'next-themes'
import { useEffect, useState, type MouseEventHandler } from 'react'
import { Button } from '../../../_components/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

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
