import type { Edge } from '@/models/edge'
import { fetchExtended } from '@/services/lib/fetch'
import { ApiResponse } from '@/services/types'

export const addEdge = async (subFlowId: number, edge: Omit<Edge, 'id'>) => {
  const response = await fetchExtended<ApiResponse<{ id: number }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edges`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flowId: subFlowId,
        data: edge,
      }),
    },
  )

  return response.body.data
}
