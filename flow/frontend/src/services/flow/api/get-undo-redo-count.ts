import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getUndoRedoCount = async (subFlowId: number) => {
  const response = await fetchExtended<
    ApiResponse<{ undocnt: number; redocnt: number }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/do/count/${subFlowId}`, {
    method: 'GET',
  })

  return response.body.data
}
