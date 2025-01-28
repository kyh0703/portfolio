import type { MenuCheckOption } from '@/models/define'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getMenuOption = async (menuId: number) => {
  const response = await fetchExtended<ApiResponse<MenuCheckOption>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/menuopt/${menuId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
