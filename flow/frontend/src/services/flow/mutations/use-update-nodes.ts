import type { CustomResponse } from '@/services'
import { toModelNode } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppNode } from '@xyflow/react'
import { toast } from 'react-toastify'
import { updateNodes } from '..'

type Response = unknown
type Variables = { nodes: Partial<AppNode>[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateNodes = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ nodes }) => {
      if (nodes.length === 0) {
        return Promise.resolve()
      }
      return updateNodes(nodes.map((node) => toModelNode(node as AppNode)))
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
