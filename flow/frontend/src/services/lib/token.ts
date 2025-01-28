import type { Token } from '..'

export const getTokens = () => {
  if (typeof window === 'undefined') {
    return
  }
  const auth = window.sessionStorage.getItem('auth')
  if (!auth) {
    return
  }
  const token: Token = JSON.parse(auth)
  return { ...token }
}

export const setTokens = (token: Token) => {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.setItem('auth', JSON.stringify(token))
}
