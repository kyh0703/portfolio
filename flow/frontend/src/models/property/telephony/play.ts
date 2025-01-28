import type {
  ChatInfo,
  General,
  MentInfo,
  Tracking,
  VisualARSInfo,
} from '../common'

export interface Play {
  general: General
  ment: MentInfo
  chat: ChatInfo
  vars: VisualARSInfo
  tracking: Tracking
}
