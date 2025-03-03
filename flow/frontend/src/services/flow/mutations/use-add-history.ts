import type { HistoryType } from '@/hooks/xyflow/use-undo-redo'
import type { Edge } from '@/models/edge'
import type { Node } from '@/models/node'
import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addHistory } from '..'

type Response = { undoCount: number; redoCount: number }
type Variables = {
  flowId: number
  data: {
    type: HistoryType
    nodes: Node[]
    edges: Edge[]
  }
}
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddHistory = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ flowId, data }) => {
      return addHistory(flowId, data)
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options?.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.errormsg)

      if (options?.onError) {
        options?.onError(error, variables, context)
      }
    },
  })
}
