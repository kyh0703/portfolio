import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { menuKeys, removeMenu } from '..'

type Response = unknown
type Variables = { id: number }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useRemoveMenu = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ id }) => {
      return removeMenu(id)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [menuKeys.top] })

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
