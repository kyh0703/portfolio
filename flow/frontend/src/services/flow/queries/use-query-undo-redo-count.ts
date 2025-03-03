import { getUndoRedoCount, subFlowKeys } from '..'

export const useQueryUndoRedoCount = (flowId: number) => ({
  queryKey: [subFlowKeys.countUndoRedo(flowId)],
  queryFn: () => getUndoRedoCount(flowId),
})
