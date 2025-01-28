import type { HistoryType } from '@/hooks/xyflow'
import type { Edge } from '@/models/edge'
import type { Node } from '@/models/node'
import { fetchExtended } from '@/services/lib/fetch'
import { type ApiResponse } from '@/services/types'

export const addHistory = async (
  subFlowId: number,
  data: {
    type: HistoryType
    nodes: Node[]
    edges: Edge[]
  },
) => {
  const response = await fetchExtended<
    ApiResponse<{
      undocnt: number
      redocnt: number
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/do/${subFlowId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
    }),
  })

  return response.body.data
}
