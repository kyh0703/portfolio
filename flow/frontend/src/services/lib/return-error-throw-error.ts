import { CustomError, type CustomResponse } from '@/services'
import type { ReturnFetch } from 'return-fetch'
import returnFetch from 'return-fetch'
import { parseJsonSafely } from './return-body'

export const returnFetchThrowError: ReturnFetch = (args) =>
  returnFetch({
    ...args,
    interceptors: {
      response: async (response) => {
        if (response.status < 400) {
          return response
        }

        const text = await response.text()
        const body = parseJsonSafely(text) as CustomResponse
        if (body.code) {
          throw new CustomError(body.code, response.status)
        }

        throw new Error(text)
      },
    },
  })
