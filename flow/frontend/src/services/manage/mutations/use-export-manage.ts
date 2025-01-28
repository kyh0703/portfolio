import { ExportVariables } from '@/models/manage'
import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { exportFile } from '../api'

type Response = string | undefined
type Variables = ExportVariables
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useExportManage = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (exportData) => {
      return exportFile(exportData)
    },
    onSuccess: (data, variables, context) => {
      toast.success(`data: ${data}`)

      if (options?.onSuccess) {
        options?.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      // NOTE: 파일 만드는 중 하나라도 실패하면 실패 처리 된다
      toast.error(`Fail: ${error.errormsg}`)

      if (options?.onError) {
        options?.onError(error, variables, context)
      }
    },
  })
}
