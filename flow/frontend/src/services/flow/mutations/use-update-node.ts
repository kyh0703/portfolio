import type { CustomResponse } from '@/services'
import { toModelNode } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppNode } from '@xyflow/react'
import { toast } from 'react-toastify'
import { updateNode } from '..'

type Response = unknown
type Variables = { nodeId: number; node: Partial<AppNode> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateNode = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ nodeId, node }) => {
      return updateNode(nodeId, toModelNode(node as AppNode))
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
