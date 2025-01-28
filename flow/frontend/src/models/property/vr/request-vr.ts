import type {
  ChatInfo,
  General,
  MentInfo,
  RecognizeInfo,
  Tracking,
} from '../common'

export interface RequestVR {
  general: General
  recognizeInfo: RecognizeInfo
  ment: MentInfo
  chat: ChatInfo
  tracking: Tracking
}
