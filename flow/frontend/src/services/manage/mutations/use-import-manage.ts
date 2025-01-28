import type { CustomResponse } from '@/services'
import { flowKeys } from '@/services/flow'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { importFile } from '../api'

type Response = { failInfo: { name: string; msg: string }[] }
type Variables = FormData
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useImportManage = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (files) => {
      return importFile(files)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [flowKeys.subFlowTree],
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
