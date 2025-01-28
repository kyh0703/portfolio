import { getMenus, menuKeys } from '..'

export const useQueryMenus = () => ({
  queryKey: [menuKeys.all],
  queryFn: () => getMenus(),
})
