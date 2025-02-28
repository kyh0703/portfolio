import { generateShortId } from "./id"

function getSubFlowPath(
  subFlowId?: number,
  focusNode?: string,
  focusTab?: string,
): string {
  let absolutePath = `/sub-flows`
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

export { getSubFlowPath }
