import type { CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const unJoinCommonFlow = async (commonFlowId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/commonsubflows/unjoin/${commonFlowId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
