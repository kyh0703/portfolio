import type { CustomResponse } from '@/services'
import type { DefineScope, DefineType } from '@/types/define'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateDefine } from '..'

type Response = unknown
type Variables<T> = {
  databaseId: number
  scope: DefineScope
  type: DefineType
  defineId: string
  data: Partial<T>
}
type MutationOptions<T> = UseMutationOptions<
  Response,
  CustomResponse,
  Variables<T>
>

export const useUpdateDefine = <T>(options?: MutationOptions<T>) => {
  return useMutation<Response, CustomResponse, Variables<T>>({
    ...options,
    mutationFn: (data) => {
      return updateDefine(data)
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
