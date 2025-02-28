import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { removeNodes } from '..'

type Response = unknown
type Variables = { id: number }[]
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useRemoveNodes = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: (nodeIds) => {
      if (nodeIds.length === 0) {
        return Promise.resolve()
      }
      return removeNodes(nodeIds)
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
