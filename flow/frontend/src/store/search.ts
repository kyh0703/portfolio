import type { SearchTreeData } from '@/models/web-socket/search/types'
import { createStore } from './store'

interface SearchState {
  data: SearchTreeData[]
  search: string
  replace: string
  isOpenReplace: boolean
  useMatchWholeWord: boolean
  useMatchCase: boolean
  subFlowName: string
  nodeKind: string
  propertyName: string
  highlightText: string
  setData: (value: SearchTreeData[]) => void
  setSearch: (value: string) => void
  setReplace: (value: string) => void
  toggleIsOpenReplace: () => void
  toggleUseMatchWholeWord: () => void
  toggleUseMatchCase: () => void
  setSubFlowName: (value: string) => void
  setNodeKind: (value: string) => void
  setPropertyName: (value: string) => void
  resetAll: () => void
  setHighlightText: (value: string) => void
}

export const useSearchStore = createStore<SearchState>(
  (set) => ({
    data: [],
    search: '',
    replace: '',
    isOpenReplace: false,
    useMatchWholeWord: false,
    useMatchCase: false,
    subFlowName: '',
    nodeKind: '',
    propertyName: '',
    highlightText: '',
    setData: (value) => set({ data: value }),
    setSearch: (value) => set({ search: value }),
    setReplace: (value) => set({ replace: value }),
    toggleIsOpenReplace: () =>
      set((state) => ({
        isOpenReplace: !state.isOpenReplace,
      })),
    toggleUseMatchWholeWord: () =>
      set((state) => ({
        useMatchWholeWord: !state.useMatchWholeWord,
      })),
    toggleUseMatchCase: () =>
      set((state) => ({
        useMatchCase: !state.useMatchCase,
      })),
    setSubFlowName: (value) => set({ subFlowName: value }),
    setNodeKind: (value) => set({ nodeKind: value }),
    setPropertyName: (value) => set({ propertyName: value }),
    resetAll: () =>
      set({
        data: [],
        search: '',
        replace: '',
        useMatchWholeWord: false,
        useMatchCase: false,
        subFlowName: '',
        nodeKind: '',
        propertyName: '',
      }),
    setHighlightText: (value) => set({ highlightText: value }),
  }),
  {
    name: 'searchStore',
  },
)
