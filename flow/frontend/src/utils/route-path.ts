import { generateShortId } from "./id"

function getMenuPath(rootId: number): string {
  return `/defines/global/menu/${rootId}`
}

function getDefinePath(scope: string, type: string, defineId?: number): string {
  let absolutePath = `/defines/${scope}/${type}`
  if (defineId) {
    absolutePath += `/${defineId}`
  }
  return absolutePath
}

function getSubFlowPath(
  subFlowId?: number,
  focusNode?: string,
  focusTab?: string,
): string {
  let absolutePath = `/subflows`
  if (!subFlowId) {
    return absolutePath
  }

  absolutePath += `/${subFlowId}`
  if (focusNode) {
    absolutePath += `?focusNode=${focusNode}`
  }
  if (focusTab) {
    absolutePath += `&focusTab=${focusTab}`
  }
  if (focusTab || focusNode) {
    absolutePath += `&t=${generateShortId()}`
  }
  return absolutePath
}

export { getDefinePath, getMenuPath, getSubFlowPath }
