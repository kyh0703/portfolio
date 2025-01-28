import { createJSONStorage } from 'zustand/middleware'
import { createPersistStore } from './store'

type Context = {
  tenantId: string
  serviceId: string
  version: string
  id: number
  name: string
  desc: string
  type: string
  user: {
    userName: string
    userLevel: string
  }
  url: string
  localIp: string
}

interface ContextState {
  ctx: Context | null
  Initialize: (ctx: Context) => void
}

export const useContextStore = createPersistStore<ContextState>(
  (set) => ({
    ctx: null,
    Initialize(ctx) {
      set({ ctx })
    },
  }),
  {
    name: 'contextStore',
    storage: createJSONStorage(() => sessionStorage),
  },
)

export function useUserContext() {
  const ctx = useContextStore((state) => state.ctx)
  if (!ctx) {
    throw new Error('useUserContext must be used within a UserStore')
  }
  return ctx
}
