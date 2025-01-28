import { Option } from '@/models/manage'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getOption = async () => {
  const response = await fetchExtended<ApiResponse<Option>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/admins/option`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
