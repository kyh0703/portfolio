import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const getExports = async () => {
  const response = await fetchExtended<ApiResponse<string[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/admins/export/list`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
