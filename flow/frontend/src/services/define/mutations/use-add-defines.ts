import type { CustomResponse } from '@/services'
import type { DefineScope, DefineType } from '@/types/define'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addDefines, defineKeys } from '..'

type Response<T> = {
  list: { id: number; defineId: string; property: T; updateTime: Date }[]
}
type Variables<T> = {
  data: {
    scope: DefineScope
    type: DefineType
    defineId: string
    data: T
  }[]
}
type MutationOptions<T> = UseMutationOptions<
  Response<T>,
  CustomResponse,
  Variables<T>
>

export const useAddDefines = <T>(
  type: DefineType,
  options?: MutationOptions<T>,
) => {
  const queryClient = useQueryClient()

  return useMutation<Response<T>, CustomResponse, Variables<T>>({
    ...options,
    mutationFn: (data) => {
      return addDefines(data)
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
