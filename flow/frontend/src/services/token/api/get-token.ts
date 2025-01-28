import type { Token } from '@/models/token'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getToken = async () => {
  const response = await fetchExtended<ApiResponse<Token>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/token`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
