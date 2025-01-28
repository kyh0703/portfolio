import { fetchExtended } from '@/services/lib/fetch'
import { ApiResponse } from '@/services/types'

export const addSnapshot = async (flowId: number) => {
  const response = await fetchExtended<ApiResponse<{ id: number }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/snapshot/capture/${flowId}`,
    {
      method: 'POST',
    },
  )

  return response.body.data
}
