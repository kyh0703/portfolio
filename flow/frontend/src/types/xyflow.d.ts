import {
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
  type XYPosition,
} from '@xyflow/react'

declare module '@xyflow/react' {
  type HelperLine = number | undefined

  type Group = {
    width: number
    height: number
    collapsed: boolean
  }

  type Style = {
    color: string
    backgroundColor: string
    borderColor: string
    borderStyle: string
    opacity: string
    fontSize: string
    hidden: boolean
  }

  type CustomNodeData = {
    subFlowId: number
    databaseId: number
    label: string
    group: Partial<Group>
    style: Partial<Style>
    desc: string
  }

  type CustomNodeType =
    // AI
    | 'EntityCall'
    | 'IntentCall'
    | 'NLURequest'
    // Database
    | 'DBQuery'
    // Etc
    | 'Group'
    | 'Memo'
    // Event
    | 'SetEvent'
    | 'WaitEvent'
    // Flow
    | 'Assign'
    | 'CdrCall'
    | 'CdrCtrl'
    | 'Cdr'
    | 'ChangeService'
    | 'GotoLabel'
    | 'If'
    | 'MenuCall'
    | 'MenuChange'
    | 'MenuReturn'
    | 'Return'
    | 'Select'
    | 'SetLabel'
    | 'Sleep'
    | 'Start'
    | 'StringParser'
    | 'SubCall'
    | 'UserEnv'
    // iWeb
    | 'DisconnectWeb'
    | 'GetPageData'
    | 'RegistServer'
    | 'RequestPage'
    | 'UnregistServer'
    | 'WaitWebInbound'
    // Log
    | 'LogWrite'
    // Packet
    | 'PacketCall'
    | 'PacketJson'
    | 'PacketSize'
    | 'RequestHTTP'
    // Route
    | 'RouteACD'
    | 'RouteGroup'
    | 'RouteQueueRule'
    | 'RouteSkill'
    | 'RouteSkillGroup'
    | 'UserData'
    // Telephony
    | 'Abort'
    | 'ChoiceCall'
    | 'ChoiceMent'
    | 'CtiCall'
    | 'Disconnect'
    | 'DisSwitch'
    | 'GetChannel'
    | 'GetDigit'
    | 'MakeCall'
    | 'Play'
    | 'PushTone'
    | 'Record'
    | 'Switch'
    | 'ToneDetect'
    | 'Transfer'
    | 'WaitInbound'
    | 'WaitOutbound'
    // Tracking
    | 'ConsumerMonit'
    | 'Tracking'
    | 'UserMenuStat'
    // UserFunc
    | 'UserFuncCall'
    // VR
    | 'CloseVR'
    | 'OpenVR'
    | 'RequestVR'
    | 'ResponseVR'
    | 'VoiceRecognize'
    // Custom
    | 'Ghost'

  type AppNode = Node<Partial<CustomNodeData>, CustomNodeType>
  type CustomNodeProps = NodeProps<AppNode>

  type ControlPointData = XYPosition & {
    id: string
    active?: boolean
    prev?: string
  }

  type CustomEdgeData = {
    subFlowId: number
    databaseId: number
    condition: string
    points: ControlPointData[]
  }

  type CustomEdgeType =
    // AI
    | 'EntityCall'
    | 'IntentCall'
    | 'NLURequest'
    // Database
    | 'DBQuery'
    // Etc
    | 'Group'
    | 'Memo'
    // Event
    | 'SetEvent'
    | 'WaitEvent'
    // Flow
    | 'Assign'
    | 'CdrCall'
    | 'CdrCtrl'
    | 'Cdr'
    | 'ChangeService'
    | 'GotoLabel'
    | 'If'
    | 'MenuCall'
    | 'MenuChange'
    | 'MenuReturn'
    | 'Return'
    | 'Select'
    | 'SetLabel'
    | 'Sleep'
    | 'Start'
    | 'StringParser'
    | 'SubCall'
    | 'UserEnv'
    // iWeb
    | 'DisconnectWeb'
    | 'GetPageData'
    | 'RegistServer'
    | 'RequestPage'
    | 'UnregistServer'
    | 'WaitWebInbound'
    // Log
    | 'LogWrite'
    // Packet
    | 'PacketCall'
    | 'PacketJson'
    | 'PacketSize'
    | 'RequestHttp'
    // Route
    | 'RouteAcd'
    | 'RouteGroup'
    | 'RouteQueueRule'
    | 'RouteSkillGroup'
    | 'RouteSkill'
    | 'UserData'
    // Telephony
    | 'Abort'
    | 'ChoiceMent'
    | 'Disconnect'
    | 'DisSwitch'
    | 'GetChannel'
    | 'GetDigit'
    | 'MakeCall'
    | 'Play'
    | 'PlayVideo'
    | 'PushTone'
    | 'Record'
    | 'Switch'
    | 'ToneDetect'
    | 'Transfer'
    | 'WaitInbound'
    | 'WaitOutbound'
    // Tracking
    | 'ConsumerMonit'
    | 'Tracking'
    | 'UserMenuStat'
    // UserFunc
    | 'UserFuncCall'
    // VR
    | 'CloseVR'
    | 'OpenVR'
    | 'RequestVR'
    | 'ResponseVR'
    | 'VoiceRecognize'
    // Custom
    | 'Ghost'
    | BuiltInEdge

  type AppEdge = Edge<Partial<CustomEdgeData>, CustomEdgeType>
  type CustomEdgeProps = EdgeProps<AppEdge>
}
