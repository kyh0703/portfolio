import type { SubFlow } from '@/models/sub-flow'
import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const addSubFlow = async (subFlow: Omit<SubFlow, 'id'>) => {
  const response = await fetchExtended<
    ApiResponse<{ flowId: number; updateTime: Date }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subFlow),
  })

  return response.body.data
}
