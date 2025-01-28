import type { HistoryType } from '@/hooks/xyflow'
import type { Edge } from '@/models/edge'
import type { Node } from '@/models/node'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getUndo = async (subFlowId: number) => {
  const response = await fetchExtended<
    ApiResponse<{
      type: HistoryType
      undocnt: number
      redocnt: number
      nodes: Node[]
      edges: Edge[]
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/undo/${subFlowId}`, {
    method: 'GET',
  })

  return response.body.data
}
