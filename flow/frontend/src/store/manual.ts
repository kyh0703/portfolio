import { createStore } from './store'

interface ManualState {
  search: string
  setSearch: (keyword: string) => void
  results: string[]
  setResults: (results: string[]) => void
}

export const useManualStore = createStore<ManualState>(
  (set) => ({
    search: '',
    setSearch: (search) => set({ search }),
    results: [],
    setResults: (results) => set({ results }),
  }),
  {
    name: 'manualState',
  },
)
