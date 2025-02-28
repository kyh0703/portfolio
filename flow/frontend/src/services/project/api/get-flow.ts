import type { Flow } from '@/models/flow'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getFlow = async (id: number) => {
  const response = await fetchExtended<ApiResponse<Flow>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows/${id}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
