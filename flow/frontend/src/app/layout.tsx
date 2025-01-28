import { Noto_Sans_KR, Poppins } from 'next/font/google'
import type { PropsWithChildren } from 'react'
import Provider from './provider'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const notoSans = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  preload: true,
  variable: '--font-noto-sans-kr',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  preload: false,
  variable: '--font-poppins',
})

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo/favicon.ico" />
        <meta charSet="utf-8" />
      </head>
      <body className={`${notoSans.variable} ${poppins.variable}`}>
        <Provider>{children}</Provider>
        <div id="portal" />
      </body>
    </html>
  )
}
