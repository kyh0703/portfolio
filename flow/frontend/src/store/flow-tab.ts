import { SubFlowList } from '@/models/subflow-list'
import { createPersistStore } from './store'

type SubFlow = {
  id: number
  name: string
}

type FlowTab = {
  index: number
  subFlows: SubFlow[]
}

interface FlowTabState {
  tabs: Record<number, FlowTab>
  initializeTab: (flowId: number, subFlows: SubFlowList[]) => number
  moveTab: (flowId: number, srcIndex: number, destIndex: number) => void
  isOpenTab: (flowId: number, subFlow: SubFlow) => boolean
  openTab: (flowId: number, subFlow: SubFlow) => void
  closeTab: (flowId: number, subFlowId: number) => number
  setCurrentTabIndex: (flowId: number, index: number) => void
  setFlowName: (flowId: number, subFlow: SubFlow) => void
}

export const useFlowTabStore = createPersistStore<FlowTabState>(
  (set, get) => ({
    tabs: {},
    initializeTab(flowId: number, subFlowList: SubFlowList[]): number {
      const main = subFlowList.find((flow) => flow.name === 'main')
      if (!main) {
        throw new Error('Main flow not found')
      }
      set((state) => {
        state.tabs[flowId] = {
          index: 0,
          subFlows: [main],
        }
      })
      return main.id
    },
    moveTab(flowId: number, srcIndex: number, destIndex: number) {
      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }
        const subFlows = [...tab.subFlows]
        const [movedTab] = subFlows.splice(srcIndex, 1)
        subFlows.splice(destIndex, 0, movedTab)
        tab.index = destIndex
        state.tabs[flowId] = { ...tab, subFlows }
      })
    },
    isOpenTab(flowId: number, subFlow: SubFlow) {
      const tab = get().tabs[flowId] || { Index: 0, subFlows: [] }
      return tab.subFlows.some((s) => s.id === subFlow.id)
    },
    openTab(flowId: number, subFlow: SubFlow) {
      set((state) => {
        const tab = state.tabs[flowId] || { Index: 0, subFlows: [] }
        const existingTab = tab.subFlows.find((s) => s.id === subFlow.id)
        if (!existingTab) {
          tab.subFlows = [...tab.subFlows, subFlow]
          tab.index = tab.subFlows.length - 1
        } else {
          tab.index = tab.subFlows.findIndex((sf) => sf.id === subFlow.id)
        }
        state.tabs[flowId] = { ...tab }
      })
    },
    closeTab(flowId: number, subFlowId: number): number {
      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }
        tab.subFlows = tab.subFlows.filter(
          (subFlow) => subFlow.id !== subFlowId,
        )
        if (tab.subFlows.length > 0) {
          tab.index = Math.max(0, tab.index - 1)
        } else {
          tab.index = 0
        }
        state.tabs[flowId] = { ...tab }
      })

      const currentTab = get().tabs[flowId]
      return currentTab.subFlows[currentTab.index].id
    },
    setCurrentTabIndex(flowId: number, index: number) {
      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }
        tab.index = index
        state.tabs[flowId] = { ...tab }
      })
    },
    setFlowName(flowId: number, subFlow: SubFlow) {
      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }
        tab.subFlows = tab.subFlows.map((s) =>
          s.id === subFlow.id ? subFlow : s,
        )
        state.tabs[flowId] = { ...tab }
      })
    },
  }),
  {
    name: 'flowTabStore',
  },
)

export function useCurrentTab(flowId: number) {
  const tab = useFlowTabStore((state) => state.tabs[flowId])
  if (!tab) {
    throw new Error(`Tab with flowId ${flowId} not found`)
  }
  return tab
}
