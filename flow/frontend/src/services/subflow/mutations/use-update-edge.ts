import type { CustomResponse } from '@/services'
import { toModelEdge } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppEdge } from '@xyflow/react'
import { toast } from 'react-toastify'
import { updateEdge } from '..'

type Response = unknown
type Variables = { edgeId: number; edge: Partial<AppEdge> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateEdge = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ edgeId, edge }) => {
      return updateEdge(edgeId, toModelEdge(edge as AppEdge))
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
