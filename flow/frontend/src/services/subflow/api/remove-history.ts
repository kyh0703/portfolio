import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeHistory = async (subFlowId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/do/close/${subFlowId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
