import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeSubFlow = async (subFlowId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/${subFlowId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
