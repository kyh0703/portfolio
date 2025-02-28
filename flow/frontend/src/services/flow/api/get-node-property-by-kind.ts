import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getNodePropertyByKind = async (kind: string) => {
  const response = await fetchExtended<ApiResponse<string[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodeproperty/search/${kind}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
