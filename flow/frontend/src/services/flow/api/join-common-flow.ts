import type { CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const joinCommonFlow = async (commonFlowId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/commonsubflows/join/${commonFlowId}`,
    {
      method: 'POST',
    },
  )

  return response.body
}
