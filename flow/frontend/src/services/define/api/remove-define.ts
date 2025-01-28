import { fetchExtended } from '@/services/lib/fetch'
import { ApiResponse } from '@/services/types'

export const removeDefine = async (databaseId: number) => {
  const response = await fetchExtended<ApiResponse<{ updateTime: Date }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/${databaseId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body.data
}
