import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getNodePropertyByNodeId = async <T>(
  subFlowId: number,
  nodeId: string,
) => {
  const response = await fetchExtended<ApiResponse<T>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodeproperty/nodestring/${subFlowId}/${nodeId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
