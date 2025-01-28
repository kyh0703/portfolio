'use client'

import { useLayoutEffect, useState, type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'
import QueryProvider from './_lib/query-provider'
import ThemeProvider from './_lib/theme-provider'

export default function Provider({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </QueryProvider>
    </ThemeProvider>
  )
}
