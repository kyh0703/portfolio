import { type EdgeTypes } from '@xyflow/react'
import { CustomEdge } from './custom-edge'

export enum Algorithm {
  Linear = 'linear',
  CatmullRom = 'catmull-rom',
  BezierCatmullRom = 'bezier-catmull-rom',
}

export const defaultAlgorithm = Algorithm.Linear

export const edgeTypes: EdgeTypes = {
  // AI
  EntityCall: CustomEdge,
  IntentCall: CustomEdge,
  NLURequest: CustomEdge,
  // Database
  DBQuery: CustomEdge,
  // Etc
  Memo: CustomEdge,
  Group: CustomEdge,
  Start: CustomEdge,
  // Event
  SetEvent: CustomEdge,
  WaitEvent: CustomEdge,
  // Flow
  Assign: CustomEdge,
  CdrCall: CustomEdge,
  CdrCtrl: CustomEdge,
  Cdr: CustomEdge,
  ChangeService: CustomEdge,
  GotoLabel: CustomEdge,
  If: CustomEdge,
  MenuCall: CustomEdge,
  MenuChange: CustomEdge,
  MenuReturn: CustomEdge,
  Return: CustomEdge,
  Select: CustomEdge,
  SetLabel: CustomEdge,
  Sleep: CustomEdge,
  StringParser: CustomEdge,
  SubCall: CustomEdge,
  UserEnv: CustomEdge,
  // iWeb
  DisconnectWeb: CustomEdge,
  GetPageData: CustomEdge,
  RegistServer: CustomEdge,
  RequestPage: CustomEdge,
  UnregistServer: CustomEdge,
  WaitWebInbound: CustomEdge,
  // Log
  LogWrite: CustomEdge,
  // Packet
  PacketCall: CustomEdge,
  PacketJson: CustomEdge,
  PacketSize: CustomEdge,
  RequestHTTP: CustomEdge,
  // Route
  RouteACD: CustomEdge,
  RouteGroup: CustomEdge,
  RouteQueueRule: CustomEdge,
  RouteSkillGroup: CustomEdge,
  RouteSkill: CustomEdge,
  UserData: CustomEdge,
  // Telephony
  Abort: CustomEdge,
  ChoiceMent: CustomEdge,
  CtiCall: CustomEdge,
  Disconnect: CustomEdge,
  DisSwitch: CustomEdge,
  GetChannel: CustomEdge,
  GetDigit: CustomEdge,
  MakeCall: CustomEdge,
  Play: CustomEdge,
  PushTone: CustomEdge,
  Record: CustomEdge,
  Switch: CustomEdge,
  ToneDetect: CustomEdge,
  Transfer: CustomEdge,
  WaitInbound: CustomEdge,
  WaitOutbound: CustomEdge,
  // Tracking
  ConsumerMonit: CustomEdge,
  Tracking: CustomEdge,
  UserMenuStat: CustomEdge,
  // UserFunc
  UserFuncCall: CustomEdge,
  // VR
  CloseVR: CustomEdge,
  OpenVR: CustomEdge,
  RequestVR: CustomEdge,
  ResponseVR: CustomEdge,
  VoiceRecognize: CustomEdge,
  // Custom
  Ghost: CustomEdge,
}
