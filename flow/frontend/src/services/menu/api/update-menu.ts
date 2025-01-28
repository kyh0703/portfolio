import type { DefineMenu } from '@/models/define'
import { type ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const updateMenu = async (menuId: number, menu: Partial<DefineMenu>) => {
  const response = await fetchExtended<ApiResponse<{ updateTime: Date }>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/${menuId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    },
  )

  return response.body.data
}
