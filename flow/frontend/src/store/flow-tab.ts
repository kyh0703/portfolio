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
  moveTab: (flowId: number, srcIndex: number, destIndex: number) => void
  isOpenTab: (flowId: number, subFlowId: number) => boolean
  openTab: (flowId: number, subFlow: SubFlow) => void
  closeTab: (flowId: number, subFlowId: number) => number | undefined
  closeOthersTab: (
    flowId: number,
    subFlowId: number,
  ) => {
    subFlowId?: number
    closedSubFlowIds: number[]
  }
  closeAllTab: (flowId: number) => number[]
  setCurrentTabIndex: (flowId: number, index: number) => void
  setFlowName: (flowId: number, subFlow: SubFlow) => void
}

export const useFlowTabStore = createPersistStore<FlowTabState>(
  (set, get) => ({
    tabs: {},
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
    isOpenTab(flowId: number, subFlowId: number) {
      const tab = get().tabs[flowId] || { index: 0, subFlows: [] }
      return tab.subFlows.some((s) => s.id === subFlowId)
    },
    openTab(flowId: number, subFlow: SubFlow) {
      set((state) => {
        const tab = state.tabs[flowId] || { index: 0, subFlows: [] }
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
    closeTab(flowId: number, subFlowId: number): number | undefined {
      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }
        tab.subFlows = tab.subFlows.filter(
          (subFlow) => subFlow.id !== subFlowId,
        )
        if (tab.subFlows.length === 0) {
          state.tabs[flowId] = { index: 0, subFlows: [] }
        } else {
          tab.index = Math.max(0, tab.index - 1)
          state.tabs[flowId] = { ...tab }
        }
      })

      const currentTab = get().tabs[flowId]
      return currentTab
        ? currentTab.subFlows[currentTab.index]?.id ?? undefined
        : undefined
    },
    closeOthersTab(flowId: number, subFlowId: number) {
      let removedIds: number[] = []

      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }

        const subFlows = tab.subFlows.filter(
          (subFlow) => subFlow.id === subFlowId,
        )

        removedIds = tab.subFlows
          .filter((subFlow) => subFlow.id !== subFlowId)
          .map((subFlow) => subFlow.id)

        if (subFlows.length === 0) {
          state.tabs[flowId] = { index: 0, subFlows: [] }
        } else {
          tab.subFlows = subFlows
          tab.index = 0
          state.tabs[flowId] = { ...tab }
        }
      })

      const currentTab = get().tabs[flowId]
      return {
        subFlowId: currentTab?.subFlows[currentTab.index]?.id ?? undefined,
        closedSubFlowIds: removedIds,
      }
    },
    closeAllTab(flowId: number) {
      let removedIds: number[] = []

      set((state) => {
        const tab = state.tabs[flowId]
        if (!tab) {
          return
        }
        removedIds = tab.subFlows.map((subFlow) => subFlow.id)
        state.tabs[flowId] = { index: 0, subFlows: [] }
      })

      return removedIds
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
