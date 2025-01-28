import type { MenuCheckOption } from '@/models/define'
import { type CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const updateMenuOption = async (
  menuId: number,
  option: MenuCheckOption,
) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/menuopt/${menuId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(option),
    },
  )

  return response.body
}
