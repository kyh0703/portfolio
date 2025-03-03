import type { CustomResponse } from '@/services'
import { toModelNode } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppNode } from '@xyflow/react'
import { toast } from 'react-toastify'
import { addNode } from '../api'

type Response = { id: number }
type Variables = { flowId: number; data: AppNode }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddNode = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ flowId, data }) => {
      return addNode(flowId, toModelNode(data))
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
