import type {
  ChatInfo,
  General,
  MentInfo,
  RecognizeInfo,
  RecognizeResultInfo,
  Tracking,
} from '../common'

export interface VoiceRecognize {
  general: General
  recognizeInfo: RecognizeInfo
  result: RecognizeResultInfo
  ment: MentInfo
  chat: ChatInfo
  tracking: Tracking
}
