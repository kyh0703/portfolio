import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { NEXT_PUBLIC_API_BASE_PATH, API_BASE_URL } = process.env

  if (!NEXT_PUBLIC_API_BASE_PATH || !API_BASE_URL) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith(NEXT_PUBLIC_API_BASE_PATH)) {
    const pathname = request.nextUrl.pathname
      .replace(NEXT_PUBLIC_API_BASE_PATH, '')
      .replace(/\/$/, '')
    const url = new URL(`${API_BASE_URL}${pathname}`)
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
