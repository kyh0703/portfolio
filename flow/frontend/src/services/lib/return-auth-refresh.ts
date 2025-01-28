import logger from '@/utils/logger'
import type { ReturnFetch } from 'return-fetch'
import returnFetch from 'return-fetch'
import type { ApiResponse, Token } from '..'
import { getTokens, setTokens } from './token'

let retryCount = 0
let refreshing = false
let refreshPromise: Promise<void> | null = null

export const returnFetchAuthRefresh: ReturnFetch = (args) =>
  returnFetch({
    ...args,
    interceptors: {
      response: async (response, requestArgs, fetch) => {
        if (response.status !== 401) {
          return response
        }

        const token = getTokens()!
        if (!token) {
          return response
        }

        if (refreshing) {
          await refreshPromise
          return fetch(...requestArgs)
        }

        refreshing = true
        refreshPromise = fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_PATH}/token`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          },
        )
          .then(async (responseToRefresh) => {
            if (responseToRefresh.status !== 200) {
              throw Error('failed to refresh cookie')
            }

            const newToken =
              (await responseToRefresh.json()) as ApiResponse<Token>

            retryCount += 1
            logger.debug(
              `🔄 succeeded to refresh and retry request ${retryCount}`,
              newToken,
            )

            setTokens(newToken.data)

            refreshing = false
            refreshPromise = null
          })
          .catch((error) => {
            refreshing = false
            refreshPromise = null
            throw error
          })

        await refreshPromise
        console.log('refreshing after fetch', requestArgs)
        return fetch(...requestArgs)
      },
    },
  })
