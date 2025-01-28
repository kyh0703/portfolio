import { getMenuOption, menuKeys } from '..'

export const useQueryMenuOption = (menuId: number) => ({
  queryKey: [menuKeys.menuOption(menuId)],
  queryFn: () => getMenuOption(menuId),
})
