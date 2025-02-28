import type { SearchTreeData } from '@/models/web-socket/search/types'
import { createStore } from './store'

interface SearchState {
  data: SearchTreeData[]
  options: {
    search: string
    replace: string
    isOpenReplace: boolean
    useMatchWholeWord: boolean
    useMatchCase: boolean
    subFlowName: string
    nodeKind: string
    propertyName: string
  }
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
    options: {
      search: '',
      replace: '',
      isOpenReplace: false,
      useMatchWholeWord: false,
      useMatchCase: false,
      subFlowName: '',
      nodeKind: '',
      propertyName: '',
    },
    highlightText: '',
    setData: (value) => set({ data: value }),
    setSearch: (value) =>
      set((state) => {
        state.options.search = value
      }),
    setReplace: (value) =>
      set((state) => {
        state.options.replace = value
      }),
    toggleIsOpenReplace: () =>
      set((state) => {
        state.options.isOpenReplace = !state.options.isOpenReplace
      }),
    toggleUseMatchWholeWord: () =>
      set((state) => {
        state.options.useMatchWholeWord = !state.options.useMatchWholeWord
      }),
    toggleUseMatchCase: () =>
      set((state) => {
        state.options.useMatchCase = !state.options.useMatchCase
      }),
    setSubFlowName: (value) =>
      set((state) => {
        state.options.subFlowName = value
      }),
    setNodeKind: (value) =>
      set((state) => {
        state.options.nodeKind = value
      }),
    setPropertyName: (value) =>
      set((state) => {
        state.options.propertyName = value
      }),
    resetAll: () =>
      set({
        data: [],
        options: {
          search: '',
          replace: '',
          isOpenReplace: false,
          useMatchWholeWord: false,
          useMatchCase: false,
          subFlowName: '',
          nodeKind: '',
          propertyName: '',
        },
      }),
    setHighlightText: (value) => set({ highlightText: value }),
  }),
  {
    name: 'searchStore',
  },
)
