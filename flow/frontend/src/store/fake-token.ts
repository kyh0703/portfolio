import type { Token } from '@/services'
import { createStore } from './store'

interface FakeTokenState {
  token: Token | null
  setToken: (token: Token) => void
}

export const useFakeTokenStore = createStore<FakeTokenState>(
  (set) => ({
    token: null,
    setToken: (token) => set({ token }),
  }),
  {
    name: 'fakeTokenState',
  },
)
