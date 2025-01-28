import { getMenu, menuKeys } from '..'

export const useQueryMenu = (menuId: number) => ({
  queryKey: [menuKeys.detail(menuId)],
  queryFn: () => getMenu(menuId),
})
