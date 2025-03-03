import type { CustomResponse } from '@/services'
import { toModelEdge } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { type AppEdge } from '@xyflow/react'
import { toast } from 'react-toastify'
import { addEdge } from '..'

type Response = { id: number }
type Variables = { flowId: number; data: AppEdge }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddEdge = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ flowId, data }) => {
      return addEdge(flowId, toModelEdge(data))
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
