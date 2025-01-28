import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const removeMenu = async (menuId: number) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/menus/${menuId}`,
    {
      method: 'DELETE',
    },
  )

  return response.body
}
