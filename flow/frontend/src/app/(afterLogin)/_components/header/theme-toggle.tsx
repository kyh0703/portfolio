'use client'

import { Button } from '@/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState, type MouseEventHandler } from 'react'

export const dynamic = 'force-dynamic'

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
      <MoonIcon className="light-icon" size={20} />
      <SunIcon className="dark-icon" size={20} />
    </Button>
  )
}
