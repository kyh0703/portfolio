import type { Edge } from '@/models/edge'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getEdges = async (subFlowId: number) => {
  const response = await fetchExtended<ApiResponse<Edge[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edges/list/all/${subFlowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
