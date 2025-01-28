import type { SubFlow } from '@/models/subflow'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getCommonFlowIn = async () => {
  const response = await fetchExtended<ApiResponse<{ flow: SubFlow[] }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/commonsubflows/list/inflow`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
