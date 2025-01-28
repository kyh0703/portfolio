import type { Node } from '@/models/node'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const addNodes = async (subFlowId: number, nodes: Node[]) => {
  const response = await fetchExtended<ApiResponse<{ id: number }[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodes/list/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flowId: subFlowId,
        data: nodes,
      }),
    },
  )

  return response.body.data
}
