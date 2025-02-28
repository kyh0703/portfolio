const sendMessageKey = {
  BUILD_REQUEST: 'buildRequest',
  SEARCH_REQUEST: 'searchRequest',
  REPLACE_REQUEST: 'replaceRequest',
} as const

const recvMessageKey = {
  BUILD_START: 'buildStart',
  BUILD_PROGRESS: 'buildProgress',
  BUILD_RESULT: 'buildResult',
  SEARCH_PROGRESS: 'searchProgress',
  SEARCH_RESULT: 'searchResult',
  REPLACE_PROGRESS: 'replaceProgress',
  REPLACE_RESULT: 'replaceResult',
} as const

type SendMessageType = (typeof sendMessageKey)[keyof typeof sendMessageKey]
type RecvMessageType = (typeof recvMessageKey)[keyof typeof recvMessageKey]

export type { RecvMessageType, SendMessageType }
