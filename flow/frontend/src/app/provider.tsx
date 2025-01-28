'use client'

import type { PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'
import QueryProvider from './_lib/query-provider'
import ThemeProvider from './_lib/theme-provider'

export default function Provider({ children }: PropsWithChildren) {
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
