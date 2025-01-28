import { type MiniMapNodeProps } from '@xyflow/react'
import { DefaultMiniMode } from './default'
import { GroupMiniNode } from './group'
import {
  AbortMiniNode,
  AssignMiniNode,
  CdrCallMiniNode,
  CdrCtrlMiniNode,
  CdrMiniNode,
  ChangeServiceMiniNode,
  ChoiceCallMiniNode,
  ChoiceMentMiniNode,
  CloseVRMiniNode,
  ConsumerMonitMiniNode,
  CtiCallMiniNode,
  DBQueryMiniNode,
  DisSwitchMiniNode,
  DisconnectMiniNode,
  DisconnectWebMiniNode,
  EntityCallMiniNode,
  GetChannelMiniNode,
  GetDigitMiniNode,
  GetPageDataMiniNode,
  GotoLabelMiniNode,
  IfMiniNode,
  IntentCallMiniNode,
  LogWriteMiniNode,
  MakeCallMiniNode,
  MenuCallMiniNode,
  MenuChangeMiniNode,
  MenuReturnMiniNode,
  NLURequestMiniNode,
  OpenVRMiniNode,
  PacketCallMiniNode,
  PacketJsonMiniNode,
  PacketSizeMiniNode,
  PlayMiniNode,
  PushToneMiniNode,
  RecordMiniNode,
  RegistServerMiniNode,
  RequestHTTPMiniNode,
  RequestPageMiniNode,
  RequestVRMiniNode,
  ResponseVRMiniNode,
  ReturnMiniNode,
  RouteACDMiniNode,
  RouteGroupMiniNode,
  RouteQueueRuleMiniNode,
  RouteSkillGroupMiniNode,
  RouteSkillMiniNode,
  SelectMiniNode,
  SetEventMiniNode,
  SetLabelMiniNode,
  SleepMiniNode,
  StartMiniNode,
  StringParserMiniNode,
  SubCallMiniNode,
  SwitchMiniNode,
  ToneDetectMiniNode,
  TrackingMiniNode,
  TransferMiniNode,
  UnregistServerMiniNode,
  UserDataMiniNode,
  UserEnvMiniNode,
  UserFuncCallMiniNode,
  UserMenuStatMiniNode,
  VoiceRecognizeMiniNode,
  WaitEventMiniNode,
  WaitInboundMiniNode,
  WaitOutboundMiniNode,
  WaitWebInboundMiniNode,
} from './types'
import { MemoMiniNode } from './memo'

export default function MiniMapNode(props: MiniMapNodeProps) {
  const { id } = props
  if (id.includes('EntityCall')) {
    return <EntityCallMiniNode {...props} />
  } else if (id.includes('IntentCall')) {
    return <IntentCallMiniNode {...props} />
  } else if (id.includes('NLURequest')) {
    return <NLURequestMiniNode {...props} />
  } else if (id.includes('DBQuery')) {
    return <DBQueryMiniNode {...props} />
  } else if (id.includes('SetEvent')) {
    return <SetEventMiniNode {...props} />
  } else if (id.includes('WaitEvent')) {
    return <WaitEventMiniNode {...props} />
  } else if (id.includes('Assign')) {
    return <AssignMiniNode {...props} />
  } else if (id.includes('Cdr')) {
    return <CdrMiniNode {...props} />
  } else if (id.includes('CdrCall')) {
    return <CdrCallMiniNode {...props} />
  } else if (id.includes('CdrCtrl')) {
    return <CdrCtrlMiniNode {...props} />
  } else if (id.includes('ChangeService')) {
    return <ChangeServiceMiniNode {...props} />
  } else if (id.includes('GotoLabel')) {
    return <GotoLabelMiniNode {...props} />
  } else if (id.includes('If')) {
    return <IfMiniNode {...props} />
  } else if (id.includes('MenuCall')) {
    return <MenuCallMiniNode {...props} />
  } else if (id.includes('MenuChange')) {
    return <MenuChangeMiniNode {...props} />
  } else if (id.includes('MenuReturn')) {
    return <MenuReturnMiniNode {...props} />
  } else if (id.includes('Return')) {
    return <ReturnMiniNode {...props} />
  } else if (id.includes('Select')) {
    return <SelectMiniNode {...props} />
  } else if (id.includes('SetLabel')) {
    return <SetLabelMiniNode {...props} />
  } else if (id.includes('Sleep')) {
    return <SleepMiniNode {...props} />
  } else if (id.includes('Start')) {
    return <StartMiniNode {...props} />
  } else if (id.includes('StringParser')) {
    return <StringParserMiniNode {...props} />
  } else if (id.includes('SubCall')) {
    return <SubCallMiniNode {...props} />
  } else if (id.includes('UserEnv')) {
    return <UserEnvMiniNode {...props} />
  } else if (id.includes('DisconnectWeb')) {
    return <DisconnectWebMiniNode {...props} />
  } else if (id.includes('GetPageData')) {
    return <GetPageDataMiniNode {...props} />
  } else if (id.includes('RegistServer')) {
    return <RegistServerMiniNode {...props} />
  } else if (id.includes('RequestPage')) {
    return <RequestPageMiniNode {...props} />
  } else if (id.includes('UnregistServer')) {
    return <UnregistServerMiniNode {...props} />
  } else if (id.includes('WaitWebInbound')) {
    return <WaitWebInboundMiniNode {...props} />
  } else if (id.includes('LogWrite')) {
    return <LogWriteMiniNode {...props} />
  } else if (id.includes('PacketCall')) {
    return <PacketCallMiniNode {...props} />
  } else if (id.includes('PacketJson')) {
    return <PacketJsonMiniNode {...props} />
  } else if (id.includes('PacketSize')) {
    return <PacketSizeMiniNode {...props} />
  } else if (id.includes('RequestHTTP')) {
    return <RequestHTTPMiniNode {...props} />
  } else if (id.includes('RouteACD')) {
    return <RouteACDMiniNode {...props} />
  } else if (id.includes('RouteGroup')) {
    return <RouteGroupMiniNode {...props} />
  } else if (id.includes('RouteQueueRule')) {
    return <RouteQueueRuleMiniNode {...props} />
  } else if (id.includes('RouteSkillGroup')) {
    return <RouteSkillGroupMiniNode {...props} />
  } else if (id.includes('RouteSkill')) {
    return <RouteSkillMiniNode {...props} />
  } else if (id.includes('UserData')) {
    return <UserDataMiniNode {...props} />
  } else if (id.includes('Abort')) {
    return <AbortMiniNode {...props} />
  } else if (id.includes('ChoiceCall')) {
    return <ChoiceCallMiniNode {...props} />
  } else if (id.includes('ChoiceMent')) {
    return <ChoiceMentMiniNode {...props} />
  } else if (id.includes('CtiCall')) {
    return <CtiCallMiniNode {...props} />
  } else if (id.includes('Disconnect')) {
    return <DisconnectMiniNode {...props} />
  } else if (id.includes('DisSwitch')) {
    return <DisSwitchMiniNode {...props} />
  } else if (id.includes('GetChannel')) {
    return <GetChannelMiniNode {...props} />
  } else if (id.includes('GetDigit')) {
    return <GetDigitMiniNode {...props} />
  } else if (id.includes('MakeCall')) {
    return <MakeCallMiniNode {...props} />
  } else if (id.includes('Play')) {
    return <PlayMiniNode {...props} />
  } else if (id.includes('PushTone')) {
    return <PushToneMiniNode {...props} />
  } else if (id.includes('Record')) {
    return <RecordMiniNode {...props} />
  } else if (id.includes('Switch')) {
    return <SwitchMiniNode {...props} />
  } else if (id.includes('ToneDetect')) {
    return <ToneDetectMiniNode {...props} />
  } else if (id.includes('Transfer')) {
    return <TransferMiniNode {...props} />
  } else if (id.includes('WaitInbound')) {
    return <WaitInboundMiniNode {...props} />
  } else if (id.includes('WaitOutbound')) {
    return <WaitOutboundMiniNode {...props} />
  } else if (id.includes('ConsumerMonit')) {
    return <ConsumerMonitMiniNode {...props} />
  } else if (id.includes('Tracking')) {
    return <TrackingMiniNode {...props} />
  } else if (id.includes('UserMenuStat')) {
    return <UserMenuStatMiniNode {...props} />
  } else if (id.includes('UserFuncCall')) {
    return <UserFuncCallMiniNode {...props} />
  } else if (id.includes('CloseVR')) {
    return <CloseVRMiniNode {...props} />
  } else if (id.includes('OpenVR')) {
    return <OpenVRMiniNode {...props} />
  } else if (id.includes('RequestVR')) {
    return <RequestVRMiniNode {...props} />
  } else if (id.includes('ResponseVR')) {
    return <ResponseVRMiniNode {...props} />
  } else if (id.includes('VoiceRecognize')) {
    return <VoiceRecognizeMiniNode {...props} />
  } else if (id.includes('Memo')) {
    return <MemoMiniNode {...props} />
  } else if (id.includes('Group')) {
    return <GroupMiniNode {...props} />
  } else {
    return <DefaultMiniMode {...props} />
  }
}
