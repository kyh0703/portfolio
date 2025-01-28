import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getTopMenus = async () => {
  const response = await fetchExtended<ApiResponse<MenuList[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/list/top`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
