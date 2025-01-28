import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getSnapshots = async (flowId: number) => {
  const response = await fetchExtended<ApiResponse<string[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/snapshot/list/${flowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
