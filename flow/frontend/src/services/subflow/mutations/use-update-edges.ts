import type { CustomResponse } from '@/services'
import { toModelEdge } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppEdge } from '@xyflow/react'
import { toast } from 'react-toastify'
import { updateEdges } from '..'

type Response = unknown
type Variables = { edges: Partial<AppEdge>[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateEdges = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ edges }) => {
      if (edges.length === 0) {
        return Promise.resolve()
      }
      return updateEdges(edges.map((edge) => toModelEdge(edge as AppEdge)))
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
