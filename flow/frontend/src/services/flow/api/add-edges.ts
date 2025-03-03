import type { Edge } from '@/models/edge'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const addEdges = async (flowId: number, data: Edge[]) => {
  const response = await fetchExtended<ApiResponse<Edge[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edges/list/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flowId,
        data,
      }),
    },
  )

  return response.body.data
}
