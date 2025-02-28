import type { FlowTree } from '@/models/subflow-list'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getCommonFlowTree = async () => {
  const response = await fetchExtended<ApiResponse<{ flowtree: FlowTree[] }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows/commonflowtree`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
