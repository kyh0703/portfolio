import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const getVariables = async (subFlowId: number) => {
  const response = await fetchExtended<ApiResponse<string[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/variables/list/${subFlowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
