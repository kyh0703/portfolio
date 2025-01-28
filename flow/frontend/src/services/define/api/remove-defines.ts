import { fetchExtended } from '@/services/lib/fetch'
import { ApiResponse } from '@/services/types'

export const removeDefines = async (data: { data: { id: number }[] }) => {
  const response = await fetchExtended<ApiResponse<{ updateTime: Date }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/list/delete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  return response.body.data
}
