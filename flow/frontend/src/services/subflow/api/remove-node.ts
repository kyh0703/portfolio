import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeNode = async (nodeId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodes/${nodeId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
