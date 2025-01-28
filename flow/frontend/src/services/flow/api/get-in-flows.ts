import type { SubFlowList } from '@/models/subflow-list'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getInFlows = async () => {
  const response = await fetchExtended<ApiResponse<{ flow: SubFlowList[] }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/subflows/list/all/common`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
