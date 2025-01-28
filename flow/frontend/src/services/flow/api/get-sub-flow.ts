import type { SubFlow } from '@/models/subflow'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getSubFlow = async (subFlowId: number) => {
  const response = await fetchExtended<ApiResponse<SubFlow>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/${subFlowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
