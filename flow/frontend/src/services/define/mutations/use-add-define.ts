import type { CustomResponse } from '@/services'
import type { DefineScope, DefineType } from '@/types/define'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addDefine, defineKeys } from '..'

type Response = { defineId: number; updateTime: Date }
type Variables<T> = {
  scope: DefineScope
  type: DefineType
  defineId: string
  data: T
}
type MutationOptions<T> = UseMutationOptions<
  Response,
  CustomResponse,
  Variables<T>
>

export const useAddDefine = <T>(
  type: DefineType,
  options?: MutationOptions<T>,
) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables<T>>({
    ...options,
    mutationFn: (data) => addDefine(data),
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
