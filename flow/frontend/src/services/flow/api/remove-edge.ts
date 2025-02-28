import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeEdge = async (edgeId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edges/${edgeId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
