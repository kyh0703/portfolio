import type { SubFlow } from '@/models/flow'
import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const replicateCommonFlow = async (
  commonFlowId: number,
  commonFlow: Omit<SubFlow, 'id'>,
) => {
  const response = await fetchExtended<
    ApiResponse<{ flowId: number; updateTime: Date }>
  >(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/commonsubflows/replicate/${commonFlowId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commonFlow),
    },
  )

  return response.body.data
}
