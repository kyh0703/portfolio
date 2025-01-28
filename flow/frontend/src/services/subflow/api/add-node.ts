import type { Node } from '@/models/node'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const addNode = async (subFlowId: number, node: Omit<Node, 'id'>) => {
  const response = await fetchExtended<ApiResponse<{ id: number }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flowId: subFlowId,
        data: node,
      }),
    },
  )

  return response.body.data
}
