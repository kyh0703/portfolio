import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { removeEdges } from '..'

type Response = unknown
type Variables = { id: number }[]
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useRemoveEdges = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: (edgeIds) => {
      if (edgeIds.length === 0) {
        return Promise.resolve()
      }
      return removeEdges(edgeIds)
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
