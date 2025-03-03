import { generateShortId } from './id'

function getFlowPath(
  flowId?: number,
  focusNode?: string,
  focusTab?: string,
): string {
  let absolutePath = `/flow`
  if (!flowId) {
    return absolutePath
  }

  absolutePath += `/${flowId}`
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

export { getFlowPath }
