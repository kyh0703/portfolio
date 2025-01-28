export const menuKeys = {
  all: ['menus'] as const,
  top: ['menusTop'] as const,
  tree: ['menuTree'] as const,
  option: ['menuOption'] as const,
  detail: (menuId: number) => [menuKeys.all, menuId] as const,
  menuTree: (menuId: number) => [menuKeys.tree, menuId] as const,
  menuOption: (menuId: number) => [menuKeys.option, menuId] as const,
}
