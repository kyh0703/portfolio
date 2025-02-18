import type { SelectedNode } from '@/store/sub-flow'
import EntityCallProperty from './ai/entity-call-property'
import IntentCallProperty from './ai/intent-call-property'
import NLURequestProperty from './ai/nlu-request-property'
import DBQueryProperty from './database/db-query-property'
import SetEventProperty from './event/set-event-property'
import WaitEventProperty from './event/wait-event-property'
import AssignProperty from './flow/assign-property'
import CdrCallProperty from './data/cdr-call-property'
import CdrCtrlProperty from './data/cdr-ctrl-property'
import CdrProperty from './data/cdr-property'
import ChangeServiceProperty from './flow/change-service-property'
import GotoLabelProperty from './flow/goto-label-property'
import IfProperty from './flow/if-property'
import MenuCallProperty from './flow/menu-call-property'
import MenuChangeProperty from './flow/menu-change-property'
import MenuReturnProperty from './flow/menu-return-property'
import ReturnProperty from './flow/return-property'
import SelectProperty from './flow/select-property'
import SetLabelProperty from './flow/set-label-property'
import SleepProperty from './flow/sleep-property'
import StartProperty from './flow/start-property'
import StringParserProperty from './data/string-parser-property'
import SubCallProperty from './flow/sub-call-property'
import UserEnvProperty from './data/user-env-property'
import DisconnectWebProperty from './i-web/disconnect-web-property'
import GetPageDataProperty from './i-web/get-page-data-property'
import RegistServerProperty from './i-web/regist-server-property'
import RequestPageProperty from './i-web/request-page-property'
import UnregistServerProperty from './i-web/unregist-server-property'
import WaitWebInboundProperty from './i-web/wait-web-inbound-property'
import LogWriteProperty from './log/log-write-property'
import PacketCallProperty from './packet/packet-call-property'
import PacketJsonProperty from './packet/packet-json-property'
import PacketSizeProperty from './packet/packet-size-property'
import RequestHTTPProperty from './packet/request-http-property'
import RouteAcdProperty from './route/route-acd-property'
import RouteGroupProperty from './route/route-group-property'
import RouteQueueRuleProperty from './route/route-queue-rule-property'
import RouteSkillGroupProperty from './route/route-skill-group-property'
import RouteSkillProperty from './route/route-skill-property'
import UserDataProperty from './route/user-data-property'
import AbortProperty from './telephony/abort-property'
import ChoiceCallProperty from './telephony/choice-call-property'
import ChoiceMentProperty from './telephony/choice-ment-property'
import CtiCallProperty from './telephony/cti-call-property'
import DisSwitchProperty from './telephony/dis-switch-property'
import DisconnectProperty from './telephony/disconnect-property'
import GetChannelProperty from './telephony/get-channel-property'
import GetDigitProperty from './telephony/get-digit-property'
import MakeCallProperty from './telephony/make-call-property'
import PlayProperty from './telephony/play-property'
import PushToneProperty from './telephony/push-tone-property'
import RecordProperty from './telephony/record-property'
import SwitchProperty from './telephony/switch-property'
import ToneDetectProperty from './telephony/tone-detect-property'
import TransferProperty from './telephony/transfer-property'
import WaitInboundProperty from './telephony/wait-inbound-property'
import WaitOutboundProperty from './telephony/wait-outbound-property'
import ConsumerMonitProperty from './tracking/consumer-monit-property'
import TrackingProperty from './tracking/tracking-property'
import UserMenuStatProperty from './tracking/user-menu-stat-property'
import UserFuncCallProperty from './user-function/user-func-call-property'
import CloseVRProperty from './vr/close-vr-property'
import OpenVRProperty from './vr/open-vr-property'
import RequestVRProperty from './vr/request-vr-property'
import ResponseVRProperty from './vr/response-vr-property'
import VoiceRecognizeProperty from './vr/voice-recognize-property'
import type { FlowMode } from '@/models/flow'

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
  RouteACD: RouteAcdProperty,
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
  flowMode: FlowMode
  tabName: string
  focusTab?: string
} & SelectedNode
