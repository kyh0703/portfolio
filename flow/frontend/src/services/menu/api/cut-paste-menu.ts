import type { MenuTree } from '@/models/menu'
import { type ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const cutPasteMenu = async (
  localIp: string,
  target: {
    parentId: number
    rootId: number
  },
) => {
  const response = await fetchExtended<ApiResponse<MenuTree[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/menu/cutpaste`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ip: localIp,
        parentId: target.parentId,
        rootId: target.rootId,
      }),
    },
  )

  return response.body.data
}
