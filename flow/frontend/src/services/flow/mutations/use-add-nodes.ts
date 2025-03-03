import type { CustomResponse } from '@/services'
import { toModelNode } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppNode } from '@xyflow/react'
import { toast } from 'react-toastify'
import { addNodes } from '..'

type Response = { id: number }[]
type Variables = { flowId: number; data: AppNode[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddNodes = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ flowId, data }) => {
      if (data.length === 0) {
        return Promise.resolve([])
      }
      return addNodes(
        flowId,
        data.map((node) => toModelNode(node)),
      )
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
