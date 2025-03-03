import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getUndoRedoCount = async (flowId: number) => {
  const response = await fetchExtended<
    ApiResponse<{ undoCount: number; redoCount: number }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows/history/${flowId}`, {
    method: 'GET',
  })

  return response.body.data
}
