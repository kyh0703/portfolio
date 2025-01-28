import type { MenuTree, MenuTreeData } from '@/models/menu'
import { FlowTree, FlowTreeData } from '@/models/subflow-list'
import { NodeApi, TreeApi } from 'react-arborist'

function convertMenuTreeData(data: MenuTree[]): MenuTreeData[] {
  const transformNode = (node: MenuTree): MenuTreeData => {
    return {
      id: node.uuid,
      name: node.name,
      databaseId: node.id,
      children: node.children ? node.children.map(transformNode) : undefined,
    }
  }

  return data.map(transformNode)
}

function convertMenuTree(data: MenuTreeData[]): MenuTree[] {
  const transformNode = (node: MenuTreeData): MenuTree => {
    return {
      id: node.databaseId,
      name: node.name,
      uuid: node.id,
      children: node.children ? node.children.map(transformNode) : undefined,
    }
  }
  return data.map(transformNode)
}

function convertFlowTreeData(data: FlowTree[]): FlowTreeData[] {
  const transformNode = (node: FlowTree): FlowTreeData => {
    const transformedNode: FlowTreeData = {
      id: node.uuid || node.id,
      name: node.name,
      version: node.version,
      desc: node.desc,
      updateDate: node.updateDate,
      type: node.type,
      databaseId: +node.id,
    }

    // type이 'folder'일 경우에만 children을 추가
    if (node.type === 'folder' && node.children) {
      transformedNode.children = node.children
        ? node.children.map(transformNode)
        : undefined
    }

    return transformedNode
  }

  return data.map(transformNode)
}

function convertFlowTree(data: FlowTreeData[]): FlowTree[] {
  const transformNode = (node: FlowTreeData): FlowTree => {
    const transformedNode: FlowTree = {
      id: node.databaseId ? node.databaseId.toString() : node.id,
      name: node.name,
      version: node.version,
      desc: node.desc,
      updateDate: node.updateDate,
      uuid: node.id,
      type: node.type,
    }

    if (node.type === 'folder' && node.children) {
      transformedNode.children = node.children.map(transformNode)
    }

    return transformedNode
  }
  return data.map(transformNode)
}

function generateCopyName(data: FlowTreeData[], targetName: string): string {
  let maxCopyNumber = 0
  const namePattern = new RegExp(`^${targetName}_복사본(\\d+)?$`)

  function checkNames(currentNode: FlowTreeData) {
    const match = currentNode.name.match(namePattern)
    if (match) {
      if (match[1] === undefined) {
        // `-복사본`만 있는 경우
        maxCopyNumber = Math.max(maxCopyNumber, 1)
      } else {
        // `-복사본${숫자}`가 있는 경우
        maxCopyNumber = Math.max(maxCopyNumber, parseInt(match[1], 10))
      }
    }
    if (currentNode.type === 'folder') {
      currentNode.children?.forEach(checkNames)
    }
  }

  data.forEach(checkNames)

  if (maxCopyNumber === 0) {
    return `${targetName}_복사본`
  } else {
    return `${targetName}_복사본${maxCopyNumber + 1}`
  }
}

const containsTypeFolder = (nodes: NodeApi<FlowTreeData>[]): boolean => {
  if (nodes) {
    return nodes.some(
      (node) =>
        node.data.type === 'folder' || containsTypeFolder(node.children!),
    )
  } else return false
}

const containsMainEnd = (nodes: NodeApi<FlowTreeData>[]): boolean => {
  if (nodes) {
    return nodes.some(
      (node) =>
        ['main', 'end'].includes(node.data.name) ||
        containsMainEnd(node.children!),
    )
  } else return false
}

const getParentNodeId = (tree: TreeApi<FlowTreeData>) => {
  const selectedNodes = tree.selectedNodes

  if (selectedNodes.length === 0) {
    return null
  } else if (
    selectedNodes.length === 1 &&
    selectedNodes[0].data.type === 'folder'
  ) {
    return selectedNodes[0].id
  } else {
    return selectedNodes[0].level > 0 ? selectedNodes[0].parent!.id : null
  }
}

const hasDuplicateFileName = (
  nodes: FlowTreeData[],
  searchName: string,
): boolean => {
  const checkName = (node: FlowTreeData): boolean => {
    if (node.type === 'file' && node.name === searchName) {
      return true
    }
    if (node.children) {
      for (const child of node.children) {
        if (checkName(child)) {
          return true
        }
      }
    }
    return false
  }

  for (const node of nodes) {
    if (checkName(node)) {
      return true
    }
  }
  return false
}

const hasDuplicateFolderName = (
  nodes: FlowTreeData[],
  searchName: string,
): boolean => {
  const checkName = (node: FlowTreeData): boolean => {
    if (node.type === 'folder' && node.name === searchName) {
      return true
    }
    if (node.children) {
      for (const child of node.children) {
        if (checkName(child)) {
          return true
        }
      }
    }
    return false
  }

  for (const node of nodes) {
    if (checkName(node)) {
      return true
    }
  }
  return false
}

export {
  containsMainEnd,
  containsTypeFolder,
  convertFlowTree,
  convertFlowTreeData,
  convertMenuTree,
  convertMenuTreeData,
  generateCopyName,
  getParentNodeId,
  hasDuplicateFileName,
  hasDuplicateFolderName,
}
