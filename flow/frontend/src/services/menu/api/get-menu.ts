import type { DefineMenu } from '@/models/define'
import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getMenu = async (menuId: number) => {
  const response = await fetchExtended<
    ApiResponse<{
      property: DefineMenu
      updateTime: Date
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/${menuId}`, {
    method: 'GET',
  })

  return response.body.data
}
