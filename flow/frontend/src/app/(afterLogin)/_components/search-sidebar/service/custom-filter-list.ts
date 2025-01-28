import { CustomNodeType } from '@xyflow/react'

export const nodes: CustomNodeType[] = [
  'EntityCall',
  'IntentCall',
  'NLURequest',
  'DBQuery',
  'Memo',
  'Group',
  'Start',
  'SetEvent',
  'WaitEvent',
  'Assign',
  'CdrCtrl',
  'CdrCall',
  'Cdr',
  'ChangeService',
  'GotoLabel',
  'If',
  'MenuCall',
  'MenuChange',
  'MenuReturn',
  'Return',
  'Select',
  'SetLabel',
  'Sleep',
  'StringParser',
  'SubCall',
  'UserEnv',
  'DisconnectWeb',
  'GetPageData',
  'RegistServer',
  'RequestPage',
  'UnregistServer',
  'WaitWebInbound',
  'LogWrite',
  'PacketCall',
  'PacketJson',
  'PacketSize',
  'RequestHTTP',
  'RouteACD',
  'RouteGroup',
  'RouteQueueRule',
  'RouteSkill',
  'RouteSkillGroup',
  'UserData',
  'Abort',
  'ChoiceCall',
  'ChoiceMent',
  'CtiCall',
  'Disconnect',
  'DisSwitch',
  'GetChannel',
  'GetDigit',
  'MakeCall',
  'Play',
  'PushTone',
  'Record',
  'Switch',
  'ToneDetect',
  'Transfer',
  'WaitInbound',
  'WaitOutbound',
  'ConsumerMonit',
  'Tracking',
  'UserMenuStat',
  'UserFuncCall',
  'CloseVR',
  'OpenVR',
  'RequestVR',
  'ResponseVR',
  'VoiceRecognize',
]

export default class CustomFilterList {
  items: string[]
  constructor(items: string[]) {
    this.items = items
  }

  search(keyword: string) {
    return keyword === ''
      ? this.items
      : this.items.filter((item) =>
          item.toLowerCase().includes(keyword.toLowerCase()),
        )
  }

  has(keyword: string): boolean {
    return this.items.includes(keyword)
  }

  sort(list: string[]) {
    return list.sort((a, b) => a.localeCompare(b))
  }

  getList() {
    return this.items
  }
}
