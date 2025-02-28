import type { Edge } from '@/models/edge'
import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const updateEdges = async (data: Edge[]) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edges/list/update`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
      }),
    },
  )

  return response.body
}
