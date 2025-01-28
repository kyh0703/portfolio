import { getTopMenus, menuKeys } from '..'

export const useQueryTopMenus = () => ({
  queryKey: [menuKeys.top],
  queryFn: () => getTopMenus(),
})
