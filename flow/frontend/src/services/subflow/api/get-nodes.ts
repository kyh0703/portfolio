import type { Node } from '@/models/node'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getNodes = async (subFlowId: number) => {
  const response = await fetchExtended<ApiResponse<Node[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodes/list/all/${subFlowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
