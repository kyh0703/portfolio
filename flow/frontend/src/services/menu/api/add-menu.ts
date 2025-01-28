import type { DefineMenu } from '@/models/define'
import { type ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const addMenu = async (menu: Omit<DefineMenu, 'id'>) => {
  const response = await fetchExtended<
    ApiResponse<{
      menuId: number
      updateTime: Date
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(menu),
  })

  return response.body.data
}
