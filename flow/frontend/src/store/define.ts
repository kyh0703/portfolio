import type { EntityList } from '@/models/define'
import type { DefineScope, DefineType } from '@/types/define'
import { createStore } from './store'

interface EntityFormData {
  mode: 'create' | 'update'
  data?: EntityList
}

interface DefineState {
  scope: DefineScope
  page: DefineType
  formOpen: boolean
  entityData: EntityFormData | null
  setScope: (scope: DefineScope) => void
  setPage: (page: DefineType) => void
  openEntityForm: (data: EntityFormData) => void
  closeEntityForm: () => void
  resetPage(scope: DefineScope): void
}

export const useDefineStore = createStore<DefineState>(
  (set) => ({
    scope: 'global' as DefineScope,
    page: 'var' as DefineType,
    formOpen: false,
    entityData: null,
    selectedMenuId: undefined,
    setScope: (scope) => set({ scope }),
    setPage: (page) => set({ page }),
    openEntityForm: (data) => set({ formOpen: true, entityData: data }),
    closeEntityForm: () => set({ formOpen: false, entityData: null }),
    resetPage(scope) {
      set({ page: scope === 'common' ? 'ment' : 'var' })
    },
  }),
  {
    name: 'defineStore',
  },
)
