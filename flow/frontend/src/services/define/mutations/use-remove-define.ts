import type { CustomResponse } from '@/services'
import type { DefineType } from '@/types/define'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { defineKeys, removeDefine } from '..'

type Response = { updateTime: Date }
type Variables = number
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useRemoveDefine = (
  type: DefineType,
  options?: MutationOptions,
) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: async (id: number) => {
      return removeDefine(id)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [defineKeys.all(type)],
      })

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
