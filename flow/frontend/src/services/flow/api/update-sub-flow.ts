import type { SubFlow } from '@/models/subflow'
import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const updateSubFlow = async (
  subFlowId: number,
  subFlow: Partial<SubFlow>,
) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/${subFlowId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subFlow),
    },
  )

  return response.body
}
