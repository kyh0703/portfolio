import type { General, Tracking } from '../common'

export interface GetChannelInfo {
  name: string
  usrData: string
  dnGroupName: string
  mediaType: string
  scnName: string
  agent: boolean
  auth: boolean
  multi: boolean
  new: boolean
}

export interface GetChannel {
  general: General
  info: GetChannelInfo
  tracking: Tracking
}
