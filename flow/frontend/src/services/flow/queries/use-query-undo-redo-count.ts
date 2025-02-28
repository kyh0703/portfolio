import { getUndoRedoCount, subFlowKeys } from '..'

export const useQueryUndoRedoCount = (subFlowId: number) => ({
  queryKey: [subFlowKeys.countUndoRedo(subFlowId)],
  queryFn: () => getUndoRedoCount(subFlowId),
})
