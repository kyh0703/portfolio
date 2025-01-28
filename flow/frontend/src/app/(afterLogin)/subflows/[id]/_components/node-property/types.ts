import type { SelectedNode } from '@/store/sub-flow'
import EntityCallProperty from './properties/ai/entity-call-property'
import IntentCallProperty from './properties/ai/intent-call-property'
import NLURequestProperty from './properties/ai/nlu-request-property'
import DBQueryProperty from './properties/database/db-query-property'
import SetEventProperty from './properties/event/set-event-property'
import WaitEventProperty from './properties/event/wait-event-property'
import AssignProperty from './properties/flow/assign-property'
import CdrCallProperty from './properties/flow/cdr-call-property'
import CdrCtrlProperty from './properties/flow/cdr-ctrl-property'
import CdrProperty from './properties/flow/cdr-property'
import ChangeServiceProperty from './properties/flow/change-service-property'
import GotoLabelProperty from './properties/flow/goto-label-property'
import IfProperty from './properties/flow/if-property'
import MenuCallProperty from './properties/flow/menu-call-property'
import MenuChangeProperty from './properties/flow/menu-change-property'
import MenuReturnProperty from './properties/flow/menu-return-property'
import ReturnProperty from './properties/flow/return-property'
import SelectProperty from './properties/flow/select-property'
import SetLabelProperty from './properties/flow/set-label-property'
import SleepProperty from './properties/flow/sleep-property'
import StartProperty from './properties/flow/start-property'
import StringParserProperty from './properties/flow/string-parser-property'
import SubCallProperty from './properties/flow/sub-call-property'
import UserEnvProperty from './properties/flow/user-env-property'
import DisconnectWebProperty from './properties/i-web/disconnect-web-property'
import GetPageDataProperty from './properties/i-web/get-page-data-property'
import RegistServerProperty from './properties/i-web/regist-server-property'
import RequestPageProperty from './properties/i-web/request-page-property'
import UnregistServerProperty from './properties/i-web/unregist-server-property'
import WaitWebInboundProperty from './properties/i-web/wait-web-inbound-property'
import LogWriteProperty from './properties/log/log-write-property'
import PacketCallProperty from './properties/packet/packet-call-property'
import PacketJsonProperty from './properties/packet/packet-json-property'
import PacketSizeProperty from './properties/packet/packet-size-property'
import RequestHTTPProperty from './properties/packet/request-http-property'
import RouteACDProperty from './properties/route/route-acd-property'
import RouteGroupProperty from './properties/route/route-group-property'
import RouteQueueRuleProperty from './properties/route/route-queue-rule-property'
import RouteSkillGroupProperty from './properties/route/route-skill-group-property'
import RouteSkillProperty from './properties/route/route-skill-property'
import UserDataProperty from './properties/route/user-data-property'
import AbortProperty from './properties/telephony/abort-property'
import ChoiceCallProperty from './properties/telephony/choice-call-property'
import ChoiceMentProperty from './properties/telephony/choice-ment-property'
import CtiCallProperty from './properties/telephony/cti-call-property'
import DisSwitchProperty from './properties/telephony/dis-switch-property'
import DisconnectProperty from './properties/telephony/disconnect-property'
import GetChannelProperty from './properties/telephony/get-channel-property'
import GetDigitProperty from './properties/telephony/get-digit-property'
import MakeCallProperty from './properties/telephony/make-call-property'
import PlayProperty from './properties/telephony/play-property'
import PushToneProperty from './properties/telephony/push-tone-property'
import RecordProperty from './properties/telephony/record-property'
import SwitchProperty from './properties/telephony/switch-property'
import ToneDetectProperty from './properties/telephony/tone-detect-property'
import TransferProperty from './properties/telephony/transfer-property'
import WaitInboundProperty from './properties/telephony/wait-inbound-property'
import WaitOutboundProperty from './properties/telephony/wait-outbound-property'
import ConsumerMonitProperty from './properties/tracking/consumer-monit-property'
import TrackingProperty from './properties/tracking/tracking-property'
import UserMenuStatProperty from './properties/tracking/user-menu-stat-property'
import UserFuncCallProperty from './properties/user-function/user-func-call-property'
import CloseVRProperty from './properties/vr/close-vr-property'
import OpenVRProperty from './properties/vr/open-vr-property'
import RequestVRProperty from './properties/vr/request-vr-property'
import ResponseVRProperty from './properties/vr/response-vr-property'
import VoiceRecognizeProperty from './properties/vr/voice-recognize-property'

export const NodePropertyTypes = {
  // Telephony
  Abort: AbortProperty,
  ChoiceCall: ChoiceCallProperty,
  ChoiceMent: ChoiceMentProperty,
  CtiCall: CtiCallProperty,
  DisSwitch: DisSwitchProperty,
  Disconnect: DisconnectProperty,
  GetChannel: GetChannelProperty,
  GetDigit: GetDigitProperty,
  MakeCall: MakeCallProperty,
  Play: PlayProperty,
  PushTone: PushToneProperty,
  Record: RecordProperty,
  Switch: SwitchProperty,
  ToneDetect: ToneDetectProperty,
  Transfer: TransferProperty,
  WaitInbound: WaitInboundProperty,
  WaitOutbound: WaitOutboundProperty,
  // VR
  CloseVR: CloseVRProperty,
  OpenVR: OpenVRProperty,
  RequestVR: RequestVRProperty,
  ResponseVR: ResponseVRProperty,
  VoiceRecognize: VoiceRecognizeProperty,
  // iWeb
  DisconnectWeb: DisconnectWebProperty,
  GetPageData: GetPageDataProperty,
  RegistServer: RegistServerProperty,
  RequestPage: RequestPageProperty,
  UnregistServer: UnregistServerProperty,
  WaitWebInbound: WaitWebInboundProperty,
  // AI
  EntityCall: EntityCallProperty,
  IntentCall: IntentCallProperty,
  NLURequest: NLURequestProperty,
  // Route
  RouteACD: RouteACDProperty,
  RouteGroup: RouteGroupProperty,
  RouteQueueRule: RouteQueueRuleProperty,
  RouteSkill: RouteSkillProperty,
  RouteSkillGroup: RouteSkillGroupProperty,
  UserData: UserDataProperty,
  // Flow
  Assign: AssignProperty,
  Cdr: CdrProperty,
  CdrCall: CdrCallProperty,
  CdrCtrl: CdrCtrlProperty,
  ChangeService: ChangeServiceProperty,
  GotoLabel: GotoLabelProperty,
  If: IfProperty,
  MenuCall: MenuCallProperty,
  MenuChange: MenuChangeProperty,
  MenuReturn: MenuReturnProperty,
  Return: ReturnProperty,
  Select: SelectProperty,
  SetLabel: SetLabelProperty,
  Sleep: SleepProperty,
  StringParser: StringParserProperty,
  SubCall: SubCallProperty,
  UserEnv: UserEnvProperty,
  // UserFunc
  UserFuncCall: UserFuncCallProperty,
  // Packet
  PacketCall: PacketCallProperty,
  PacketJson: PacketJsonProperty,
  PacketSize: PacketSizeProperty,
  RequestHTTP: RequestHTTPProperty,
  // DB
  DBQuery: DBQueryProperty,
  // Log
  LogWrite: LogWriteProperty,
  // event
  SetEvent: SetEventProperty,
  WaitEvent: WaitEventProperty,
  // Tracking
  ConsumerMonit: ConsumerMonitProperty,
  Tracking: TrackingProperty,
  UserMenuStat: UserMenuStatProperty,
  // etc
  Start: StartProperty,
}

export type NodePropertyKey = keyof typeof NodePropertyTypes

export type NodePropertyTabProps = {
  tabName: string
  focusTab?: string
} & SelectedNode
