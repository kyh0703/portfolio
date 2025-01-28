import type {
  DefineData,
  MenuData,
  PropertyData,
  SearchTreeData,
} from '@/models/web-socket/search/types'

export const createNode = (
  tree: SearchTreeData[],
  items: any[],
  getName: (item: any) => string,
  getId: (item: any, name: string) => string,
  getChildName: (item: any) => string,
) => {
  items.forEach((item) => {
    const name = getName(item)
    const matchedNode = tree.find((node) => node.name === name)
    const childNode = {
      ...item,
      id: getId(item, name),
      name: getChildName(item),
    }

    if (matchedNode) {
      if (!matchedNode.children) {
        matchedNode.children = []
      }
      matchedNode.children.push(childNode)
    } else {
      tree.push({
        ...item,
        id: name,
        name,
        children: [childNode],
      })
    }
  })
}

export const getPropertyId = (property: PropertyData) =>
  `${property.subFlowName}/${property.nodeName}/${property.path}/${property.origin}`

export const getDefineId = (define: DefineData) =>
  `${define.defineType}/${define.scope}/${define.defineId}/${define.path}/${define.origin}`

export const getMenuId = (menu: MenuData) =>
  `menu/${menu.menuId}/${menu.menuName}/${menu.path}/${menu.origin}`

export const mapNodesHasOrigin = (
  tree: SearchTreeData[],
  {
    properties,
    defines,
    menus,
  }: { properties: PropertyData[]; defines: DefineData[]; menus: MenuData[] },
) => {
  const newTree: SearchTreeData[] = tree

  createNode(
    newTree,
    properties,
    (node) => `${node.subFlowName} / ${node.nodeName}`,
    getPropertyId,
    (node) => `${node.path.split('.').pop()} / ${node.origin}`,
  )

  createNode(
    newTree,
    defines,
    (define) => `${define.scope} / ${define.defineType}`,
    getDefineId,
    (define) => `${define.path.split('.').pop()} / ${define.origin}`,
  )

  createNode(
    newTree,
    menus,
    (menu) => `menu / ${menu.menuName}`,
    getMenuId,
    (menu) => `${menu.path.split('.').pop()} / ${menu.origin}`,
  )

  return newTree
}

export const mapPropertyNode = (node: PropertyData): SearchTreeData => {
  const name = `${node.subFlowName} / ${node.nodeName}`
  const id = `${name}/${node.nodeId}`
  return {
    ...node,
    id,
    name,
  }
}

export const mapPropertyNodeHasPath = (node: PropertyData): SearchTreeData => {
  const name = `${node.subFlowName} /  ${node.nodeName} / ${node.path.split('.').pop()}`
  const id = `${name}/${node.path}`
  return {
    ...node,
    id,
    name,
  }
}

export const mapDefineNode = (node: DefineData): SearchTreeData => {
  const text = `${node.defineType} / ${node.scope} / ${node.path.split('.').pop()}`
  return {
    ...node,
    id: `${text}/${node.defineId}`,
    name: text,
  }
}

export const mapMenuNode = (node: MenuData): SearchTreeData => {
  const text = `menu / ${node.menuName} / ${node.path.split('.').pop()}`
  return {
    ...node,
    id: `${text}/${node.menuId}`,
    name: text,
  }
}

export const mapPropertyReplaceItem = (
  node: SearchTreeData,
  replace: string,
) => {
  const {
    itemType,
    subFlowId,
    subFlowName,
    nodeId,
    nodeName,
    nodeKind,
    path,
    origin,
  } = node! as PropertyData
  return {
    itemType,
    subFlowId,
    subFlowName,
    nodeId,
    nodeName,
    nodeKind,
    path,
    origin,
    replace,
  }
}

export const mapDefineReplaceItem = (node: SearchTreeData, replace: string) => {
  const { itemType, scope, defineType, defineId, defineName, path, origin } =
    node! as DefineData
  return {
    itemType,
    scope,
    defineType,
    defineId,
    defineName,
    path,
    origin,
    replace,
  }
}

export const mapMenuReplaceItem = (node: SearchTreeData, replace: string) => {
  const { itemType, rootId, menuId, menuName, path, origin } = node! as MenuData
  return {
    itemType,
    rootId,
    menuId,
    menuName,
    path,
    origin,
    replace,
  }
}
