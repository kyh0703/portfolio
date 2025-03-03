import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeHistory = async (flowId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows/history/${flowId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
