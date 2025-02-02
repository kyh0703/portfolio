let accessToken: Token | null = null

export type Token = {
  token: string
  expiresIn: number
}

export const getToken = (): Token | null => {
  return accessToken
}

export const setToken = (token: string, expiresIn: number) => {
  accessToken = {
    token: token,
    expiresIn: expiresIn,
  }
}
