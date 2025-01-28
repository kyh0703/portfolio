import type { Edge } from '@/models/edge'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getEdge = async (edgeId: number) => {
  const response = await fetchExtended<ApiResponse<Edge>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edges/${edgeId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
