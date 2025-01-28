import { Option } from '@/models/manage'
import type { CustomResponse } from '@/services'
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateOption } from '../api/update-option'

type Response = unknown
type Variables = Option
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateOption = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: (option) => {
      return updateOption(option)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['option'],
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
