import type { CustomNodeType, Viewport } from '@xyflow/react'
import { createStore } from './store'

export type EditMode = 'grab' | 'pointer' | 'link'

export type SelectedNode = {
  subFlowId: number
  databaseId: number
  nodeId: string
  nodeType: CustomNodeType
}

type History = {
  selectedNode: SelectedNode | null
  viewPort: Viewport
}

interface SubFlowState {
  editMode: EditMode
  bookmarkNodeId: string | undefined
  history: Record<number, History>
  setEditMode: (editMode: EditMode) => void
  setBookmarkNodeId: (nodeId?: string) => void
  setSelectedNode: (
    subFlowId: number,
    selectedNode: SelectedNode | null,
  ) => void
  setViewPort: (subFlowId: number, viewPort: Viewport) => void
}

export const useSubFlowStore = createStore<SubFlowState>(
  (set) => ({
    editMode: 'grab',
    bookmarkNodeId: undefined,
    history: {},
    setEditMode(editMode) {
      set((state) => {
        state.editMode = editMode
      })
    },
    setBookmarkNodeId(nodeId) {
      set((state) => {
        state.bookmarkNodeId = nodeId
      })
    },
    setSelectedNode(subFlowId, selectedNode) {
      set((state) => {
        state.history[subFlowId] = {
          ...state.history[subFlowId],
          selectedNode,
        }
      })
    },
    setViewPort(subFlowId, viewPort) {
      set((state) => {
        state.history[subFlowId] = {
          ...state.history[subFlowId],
          viewPort,
        }
      })
    },
  }),
  {
    name: 'subFlowStore',
  },
)
