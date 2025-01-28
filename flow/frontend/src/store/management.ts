import { ManagementType } from '@/models/manage'
import { createJSONStorage } from 'zustand/middleware'
import { createPersistStore } from './store'

interface ManagementState {
  page: ManagementType
  useSnapshot: boolean
  setUseSnapshot: (snapshot: boolean) => void
  setPage: (page: ManagementType) => void
}

export const useManagementStore = createPersistStore<ManagementState>(
  (set) => ({
    page: 'options',
    useSnapshot: false,
    setPage: (page) => set({ page }),
    setUseSnapshot: (useSnapshot) => set({ useSnapshot }),
  }),
  {
    name: 'managementStore',
    storage: createJSONStorage(() => sessionStorage),
  },
)
