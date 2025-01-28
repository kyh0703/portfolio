import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeCommonFlow = async (commonFlowId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/${commonFlowId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
