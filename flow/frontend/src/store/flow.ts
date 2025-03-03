import type { CustomNodeType, Viewport } from '@xyflow/react'
import { createStore } from './store'

export type EditMode = 'grab' | 'pointer' | 'link'

export type SelectedNode = {
  flowId: number
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
    projectId: number,
    selectedNode: SelectedNode | null,
  ) => void
  setViewPort: (projectId: number, viewPort: Viewport) => void
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
    setSelectedNode(projectId, selectedNode) {
      set((state) => {
        state.history[projectId] = {
          ...state.history[projectId],
          selectedNode,
        }
      })
    },
    setViewPort(projectId, viewPort) {
      set((state) => {
        state.history[projectId] = {
          ...state.history[projectId],
          viewPort,
        }
      })
    },
  }),
  {
    name: 'subFlowStore',
  },
)
