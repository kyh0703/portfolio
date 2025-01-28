import {
  AbortIcon,
  AssignIcon,
  CdrCtrlIcon,
  CdrIcon,
  ChangeServiceIcon,
  ChoiceCallIcon,
  ChoiceMentIcon,
  CloseVRIcon,
  ConsumerMonitIcon,
  CtiCallIcon,
  DBQueryIcon,
  DisSwitchIcon,
  DisconnectIcon,
  DisconnectWebIcon,
  EntityCallIcon,
  GetChannelIcon,
  GetDigitIcon,
  GetPageDataIcon,
  GotoLabelIcon,
  GroupIcon,
  IfIcon,
  IntentCallIcon,
  LogWriteIcon,
  MakeCallIcon,
  MemoIcon,
  MenuCallIcon,
  MenuChangeIcon,
  MenuReturnIcon,
  NLURequestIcon,
  OpenVRIcon,
  PacketCallIcon,
  PacketJsonIcon,
  PacketSizeIcon,
  PlayIcon,
  PushToneIcon,
  RecordIcon,
  RegistServerIcon,
  RequestHTTPIcon,
  RequestPageIcon,
  RequestVRIcon,
  ResponseVRIcon,
  ReturnIcon,
  RouteACDIcon,
  RouteGroupIcon,
  RouteQueueRuleIcon,
  RouteSkillGroupIcon,
  RouteSkillIcon,
  SelectIcon,
  SetEventIcon,
  SetLabelIcon,
  SleepIcon,
  StringParserIcon,
  SubCallIcon,
  SwitchIcon,
  ToneDetectIcon,
  TrackingIcon,
  TransferIcon,
  UnregistServerIcon,
  UserDataIcon,
  UserEnvIcon,
  UserFuncCallIcon,
  UserMenuStatIcon,
  VoiceRecognizeIcon,
  WaitEventIcon,
  WaitInboundIcon,
  WaitOutboundIcon,
  WaitWebInboundIcon,
  type IconButtonProps,
} from '@/app/_components/icon'
import type { CustomNodeType } from '@xyflow/react'

export type Command = {
  title: string
  nodeType: CustomNodeType
  icon: React.ComponentType<IconButtonProps>
}

export const commands: Record<string, Command[]> = {
  Telephony: [
    {
      title: 'Play',
      nodeType: 'Play',
      icon: PlayIcon,
    },
    {
      title: 'Get Digit',
      nodeType: 'GetDigit',
      icon: GetDigitIcon,
    },
    {
      title: 'Wait Inbound',
      nodeType: 'WaitInbound',
      icon: WaitInboundIcon,
    },
    {
      title: 'Wait Outbound',
      nodeType: 'WaitOutbound',
      icon: WaitOutboundIcon,
    },
    {
      title: 'Disconnect',
      nodeType: 'Disconnect',
      icon: DisconnectIcon,
    },
    {
      title: 'Record',
      nodeType: 'Record',
      icon: RecordIcon,
    },
    {
      title: 'Abort',
      nodeType: 'Abort',
      icon: AbortIcon,
    },
    {
      title: 'Switch',
      nodeType: 'Switch',
      icon: SwitchIcon,
    },
    {
      title: 'DisSwitch',
      nodeType: 'DisSwitch',
      icon: DisSwitchIcon,
    },
    {
      title: 'Transfer',
      nodeType: 'Transfer',
      icon: TransferIcon,
    },
    {
      title: 'Make Call',
      nodeType: 'MakeCall',
      icon: MakeCallIcon,
    },
    {
      title: 'Get Channel',
      nodeType: 'GetChannel',
      icon: GetChannelIcon,
    },
    {
      title: 'Cti Call',
      nodeType: 'CtiCall',
      icon: CtiCallIcon,
    },
    {
      title: 'Push Tone',
      nodeType: 'PushTone',
      icon: PushToneIcon,
    },
    {
      title: 'Choice Ment',
      nodeType: 'ChoiceMent',
      icon: ChoiceMentIcon,
    },
    {
      title: 'Choice Call',
      nodeType: 'ChoiceCall',
      icon: ChoiceCallIcon,
    },
    {
      title: 'Tone Detect',
      nodeType: 'ToneDetect',
      icon: ToneDetectIcon,
    },
  ],
  VR: [
    {
      title: 'VoiceRecognize',
      nodeType: 'VoiceRecognize',
      icon: VoiceRecognizeIcon,
    },
    {
      title: 'Open VR',
      nodeType: 'OpenVR',
      icon: OpenVRIcon,
    },
    {
      title: 'Close VR',
      nodeType: 'CloseVR',
      icon: CloseVRIcon,
    },
    {
      title: 'Request VR',
      nodeType: 'RequestVR',
      icon: RequestVRIcon,
    },
    {
      title: 'Response VR',
      nodeType: 'ResponseVR',
      icon: ResponseVRIcon,
    },
  ],
  iWeb: [
    {
      title: 'Request Page',
      nodeType: 'RequestPage',
      icon: RequestPageIcon,
    },
    {
      title: 'Get PageData',
      nodeType: 'GetPageData',
      icon: GetPageDataIcon,
    },
    {
      title: 'Regist Server',
      nodeType: 'RegistServer',
      icon: RegistServerIcon,
    },
    {
      title: 'Unregist Server',
      nodeType: 'UnregistServer',
      icon: UnregistServerIcon,
    },
    {
      title: 'Wait Web Inbound',
      nodeType: 'WaitWebInbound',
      icon: WaitWebInboundIcon,
    },
    {
      title: 'Disconnect Web',
      nodeType: 'DisconnectWeb',
      icon: DisconnectWebIcon,
    },
  ],
  AI: [
    {
      title: 'NLU Request',
      nodeType: 'NLURequest',
      icon: NLURequestIcon,
    },
    {
      title: 'Intent Call',
      nodeType: 'IntentCall',
      icon: IntentCallIcon,
    },
    {
      title: 'Entity Call',
      nodeType: 'EntityCall',
      icon: EntityCallIcon,
    },
  ],
  Route: [
    {
      title: 'Route Skill',
      nodeType: 'RouteSkill',
      icon: RouteSkillIcon,
    },
    {
      title: 'Route Group',
      nodeType: 'RouteGroup',
      icon: RouteGroupIcon,
    },
    {
      title: 'Route Skill Group',
      nodeType: 'RouteSkillGroup',
      icon: RouteSkillGroupIcon,
    },
    {
      title: 'User Data',
      nodeType: 'UserData',
      icon: UserDataIcon,
    },
    {
      title: 'Route ACD',
      nodeType: 'RouteACD',
      icon: RouteACDIcon,
    },
    {
      title: 'Route QueueRule',
      nodeType: 'RouteQueueRule',
      icon: RouteQueueRuleIcon,
    },
  ],
  Flow: [
    {
      title: 'If',
      nodeType: 'If',
      icon: IfIcon,
    },
    {
      title: 'Select',
      nodeType: 'Select',
      icon: SelectIcon,
    },
    {
      title: 'Assign',
      nodeType: 'Assign',
      icon: AssignIcon,
    },
    {
      title: 'Menu Call',
      nodeType: 'MenuCall',
      icon: MenuCallIcon,
    },
    {
      title: 'Menu Return',
      nodeType: 'MenuReturn',
      icon: MenuReturnIcon,
    },
    {
      title: 'Sub Call',
      nodeType: 'SubCall',
      icon: SubCallIcon,
    },
    {
      title: 'Return',
      nodeType: 'Return',
      icon: ReturnIcon,
    },
    {
      title: 'Change Service',
      nodeType: 'ChangeService',
      icon: ChangeServiceIcon,
    },
    {
      title: 'Menu Change',
      nodeType: 'MenuChange',
      icon: MenuChangeIcon,
    },
    {
      title: 'Cdr',
      nodeType: 'Cdr',
      icon: CdrIcon,
    },
    {
      title: 'Cdr Ctrl',
      nodeType: 'CdrCtrl',
      icon: CdrCtrlIcon,
    },
    // {
    //   title: 'Cdr Call',
    //   nodeType: 'CdrCall',
    //   icon: CdrCallIcon,
    // },
    {
      title: 'Sleep',
      nodeType: 'Sleep',
      icon: SleepIcon,
    },
    {
      title: 'User Env',
      nodeType: 'UserEnv',
      icon: UserEnvIcon,
    },
    {
      title: 'Set Label',
      nodeType: 'SetLabel',
      icon: SetLabelIcon,
    },
    {
      title: 'GoToLabel',
      nodeType: 'GotoLabel',
      icon: GotoLabelIcon,
    },
    {
      title: 'String Parser',
      nodeType: 'StringParser',
      icon: StringParserIcon,
    },
  ],
  UserFunc: [
    {
      title: 'User Function Call',
      nodeType: 'UserFuncCall',
      icon: UserFuncCallIcon,
    },
  ],
  Database: [
    {
      title: 'DBQuery',
      nodeType: 'DBQuery',
      icon: DBQueryIcon,
    },
  ],
  Log: [
    {
      title: 'Log Write',
      nodeType: 'LogWrite',
      icon: LogWriteIcon,
    },
  ],
  Event: [
    {
      title: 'Set Event',
      nodeType: 'SetEvent',
      icon: SetEventIcon,
    },
    {
      title: 'Wait Event',
      nodeType: 'WaitEvent',
      icon: WaitEventIcon,
    },
  ],
  Packet: [
    {
      title: 'Packet Call',
      nodeType: 'PacketCall',
      icon: PacketCallIcon,
    },
    {
      title: 'Packet Size',
      nodeType: 'PacketSize',
      icon: PacketSizeIcon,
    },
    {
      title: 'Packet Json',
      nodeType: 'PacketJson',
      icon: PacketJsonIcon,
    },
    {
      title: 'Request Http',
      nodeType: 'RequestHTTP',
      icon: RequestHTTPIcon,
    },
  ],
  Tracking: [
    {
      title: 'Tracking',
      nodeType: 'Tracking',
      icon: TrackingIcon,
    },
    {
      title: 'Consumer Monit',
      nodeType: 'ConsumerMonit',
      icon: ConsumerMonitIcon,
    },
    {
      title: 'UserMenuStat',
      nodeType: 'UserMenuStat',
      icon: UserMenuStatIcon,
    },
  ],
  Etc: [
    {
      title: 'Memo',
      nodeType: 'Memo',
      icon: MemoIcon,
    },
    {
      title: 'Group',
      nodeType: 'Group',
      icon: GroupIcon,
    },
  ],
}
