import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { removeEdge } from '..'

type Response = unknown
type Variables = { edgeId: number }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useRemoveEdge = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ edgeId }) => {
      return removeEdge(edgeId)
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
