import type { SubFlow } from '@/models/sub-flow'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getCommonFlowInUse = async (subFlowId: number) => {
  const response = await fetchExtended<ApiResponse<{ flow: SubFlow[] }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/admins/commonflow/flowlist/${subFlowId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
