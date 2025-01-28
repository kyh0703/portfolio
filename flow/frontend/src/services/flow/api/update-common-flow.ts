import type { SubFlow } from '@/models/subflow'
import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const updateCommonFlow = async (
  commonFlowId: number,
  commonFlow: Partial<SubFlow>,
) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/commonsubflows/${commonFlowId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commonFlow),
    },
  )

  return response.body
}
