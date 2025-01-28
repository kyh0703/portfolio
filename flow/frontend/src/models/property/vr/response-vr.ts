import type {
  ChatInfo,
  General,
  MentInfo,
  RecognizeResultInfo,
  Tracking,
} from '../common'

export interface ResponseVR {
  general: General
  result: RecognizeResultInfo
  ment: MentInfo
  chat: ChatInfo
  tracking: Tracking
}
