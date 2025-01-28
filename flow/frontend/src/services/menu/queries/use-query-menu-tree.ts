import { getMenuTree, menuKeys } from '..'

export const useQueryMenuTree = (menuId: number) => ({
  queryKey: [menuKeys.menuTree(menuId)],
  queryFn: () => getMenuTree(menuId),
})
