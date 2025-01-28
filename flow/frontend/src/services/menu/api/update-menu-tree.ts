import type { MenuTree } from '@/models/menu'
import { type CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const updateMenuTree = async (menuId: number, tree: MenuTree[]) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/menutree/${menuId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tree),
    },
  )

  return response.body
}
