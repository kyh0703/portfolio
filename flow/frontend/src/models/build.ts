import type { DefineScope } from '@/types/define'

export enum LogLevel {
  OFF = 0,
  ERR = 3,
  WRN = 4,
  INF = 5,
  TRC = 6,
  LV1 = 7,
  LV2 = 8,
  LV3 = 9,
  DBG = 10,
}

export type CurrentNodeInfo = {
  id: string
  tCount: number
  pCount: number
}

export type CurrentBuildInfo = {
  subFlowId: number
  subFlowName: string
  node: CurrentNodeInfo
}

export type ProcCountInfo = {
  tCount: number
  pCount: number
}

type BuildType = 'Build' | 'Rebuild' | 'Compile'

export type MessageLog = {
  level: keyof typeof LogLevel
  message: {
    subFlowId: number
    subFlowName: string
    nodeId: number
    nodeName: string
    tabName: string
    message: string
    scope: DefineScope
  }
  type: 'Message'
  timestamp: string
}

export type StatusLog = {
  level: keyof typeof LogLevel
  message: StatusMessage
  timestamp: string
  type: 'Status'
}

export type StatusMessage = {
  procCount: number
  totalCount: number
  errorCount: number
  warnCount: number
  startTime: string
  currentInfoList: Record<string, CurrentBuildInfo>
  procCountList: Record<string, ProcCountInfo>
}

export type BuildResult = {
  type: 'buildResult'
  data: {
    buildType: BuildType
    subFlowId: number
    status: 'success' | 'failure'
    message: string
  }
  timestamp: string
}

export type BuildProgress<T> = {
  type: 'buildStart' | 'buildProgress'
  data: {
    buildType: BuildType
    logs: T
  }
  timestamp: string
}
