import type { SubFlow } from '@/models/flow'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getCommonFlow = async (commonFlowId: number) => {
  const response = await fetchExtended<ApiResponse<SubFlow>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/commonsubflows/${commonFlowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
