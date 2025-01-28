import type { MenuTree } from '@/models/menu'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getMenuTree = async (menuId: number) => {
  const response = await fetchExtended<ApiResponse<MenuTree[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/menutree/${menuId}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
