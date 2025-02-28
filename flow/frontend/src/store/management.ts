import type { ConfigKeys } from '@/app/(afterLogin)/_components/config-sidebar/items'
import { createPersistStore } from './store'

interface ManagementState {
  page: ConfigKeys
  setPage: (page: ConfigKeys) => void
}

export const useManagementStore = createPersistStore<ManagementState>(
  (set) => ({
    page: 'options',
    setPage: (page) => set({ page }),
  }),
  {
    name: 'managementStore',
  },
)
