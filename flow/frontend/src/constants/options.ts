type EmptyString<T> = T extends '' ? '\u00A0' : T

export type Format = '' | 'Hex String' | 'Normal String'
export const FORMAT_OPTIONS: EmptyString<Format>[] = [
  '\u00A0',
  'Hex String',
  'Normal String',
]

export type LogSafeMode = '' | 'Safe' | 'Mask'
export const LOG_SAFE_MODE_OPTIONS: EmptyString<LogSafeMode>[] = [
  '\u00A0',
  'Safe',
  'Mask',
]

export type SafeTone = '' | 'Safe DTMF Tone' | 'Safe DTMF Tone + Recording'
export const SAFE_TONE_OPTIONS: EmptyString<SafeTone>[] = [
  '\u00A0',
  'Safe DTMF Tone',
  'Safe DTMF Tone + Recording',
]

export type ChoiceCall = '' | "'First'" | "'Second'"
export const CHOICE_CALL_OPTIONS: EmptyString<ChoiceCall>[] = [
  '\u00A0',
  "'First'",
  "'Second'",
]

export type EndKey = '' | "'*'" | "'#'" | "'*#'"
export const END_KEY_OPTIONS: EmptyString<EndKey>[] = [
  '\u00A0',
  "'*'",
  "'#'",
  "'*#'",
]

export const RETRY_INDEX_OPTIONS: string[] = [
  '\u00A0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]

type EndMethod = 'next' | 'disconnect'
export const END_METHOD_OPTIONS: EndMethod[] = ['next', 'disconnect']

export type MediaType = 'Voice' | 'VR' | 'Call' | 'Web' | 'Record' | 'Digit'
export const MEDIA_TYPE_OPTIONS: MediaType[] = [
  'Voice',
  'VR',
  'Call',
  'Web',
  'Record',
  'Digit',
]

type MentType =
  | ''
  | 'MentID'
  | 'File'
  | 'Number'
  | 'Digit'
  | 'Count'
  | 'Ordinal'
  | 'Money'
  | 'Date'
  | 'Time'
  | 'DateTime'
  | 'DayOfWeek'
  | 'TTS-KSC5601'
  | 'TTS-Stream'
  | 'TTS-File'
export const MENT_TYPE_OPTIONS: EmptyString<MentType>[] = [
  '\u00A0',
  'MentID',
  'File',
  'Number',
  'Digit',
  'Count',
  'Ordinal',
  'Money',
  'Date',
  'Time',
  'DateTime',
  'DayOfWeek',
  'TTS-KSC5601',
  'TTS-Stream',
  'TTS-File',
]

export type MentCountry =
  | ''
  | 'CAMBODIA'
  | 'CHINA'
  | 'INDIA'
  | 'INDONESIA'
  | 'JAPAN'
  | 'KOREA, REPUBLIC OF'
  | 'MONGOLIA'
  | 'NEPAL'
  | 'THAILAND'
  | 'UNITED STATES'
  | 'VIETNAM'
export const MENT_COUNTRY_OPTIONS: EmptyString<MentCountry>[] = [
  '\u00A0',
  'CAMBODIA',
  'CHINA',
  'INDIA',
  'INDONESIA',
  'JAPAN',
  'KOREA, REPUBLIC OF',
  'MONGOLIA',
  'NEPAL',
  'THAILAND',
  'UNITED STATES',
  'VIETNAM',
]

export const TIMEOUT_OPTIONS_0_10: string[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
]

export const TIMEOUT_OPTIONS_10: string[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
]
export const TIMEOUT_OPTIONS_30: string[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '15',
  '20',
  '25',
  '30',
]

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'
export const METHOD_OPTIONS: Method[] = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
]

type ContentType = 'application/json'
export const CONTENT_TYPE_OPTIONS: ContentType[] = ['application/json']

export interface OptionType {
  label: string
  value: string
}

export type AgentType =
  | ''
  | 'Agent'
  | 'Branch office agent'
  | 'Reserve1'
  | 'Reserve2'
  | 'Reserve3'
export const AGENT_TYPE_OPTIONS: EmptyString<AgentType>[] = [
  '\u00A0',
  'Agent',
  'Branch office agent',
  'Reserve1',
  'Reserve2',
  'Reserve3',
]

export type ChatInfoGetDigitCategory = 'NORMAL' | 'TIMEOUT' | 'INPUT' | 'RETRY'
export const CHAT_INFO_GET_DIGIT_CATEGORY_OPTIONS: ChatInfoGetDigitCategory[] =
  ['NORMAL', 'TIMEOUT', 'INPUT', 'RETRY']

export type ChatInfoNluCategory = 'QUESTION' | 'TIMEOUT' | 'FAIL' | 'RETRY'
export const CHAT_INFO_NLU_CATEGORY_OPTIONS: ChatInfoNluCategory[] = [
  'QUESTION',
  'TIMEOUT',
  'FAIL',
  'RETRY',
]
export const CHAT_INFO_NLU_CATEGORY_EMPTY_OPTIONS: EmptyString<
  ChatInfoNluCategory | ''
>[] = ['\u00A0', 'QUESTION', 'TIMEOUT', 'FAIL', 'RETRY']

export type CdrType = 'Append' | 'Delete' | 'Select' | 'Update'
export const CDR_TYPE_OPTIONS: CdrType[] = [
  'Append',
  'Delete',
  'Select',
  'Update',
]

type PacketType = 'PKT1'
export const PACKET_TYPE_OPTIONS: PacketType[] = ['PKT1']

type DisconnectType = '' | 'Inbound' | 'Outbound' | 'In/Outbound'
export const DISCONNECT_TYPE_OPTIONS: EmptyString<DisconnectType>[] = [
  '\u00A0',
  'Inbound',
  'Outbound',
  'In/Outbound',
]

type TimerType = 'Second' | 'Millisecond'
export const TIMER_TYPE_OPTIONS: TimerType[] = ['Second', 'Millisecond']

type SelectCondition =
  | "'*'"
  | "'#'"
  | "'0'"
  | "'1'"
  | "'2'"
  | "'3'"
  | "'4'"
  | "'5'"
  | "'6'"
  | "'7'"
  | "'8'"
  | "'9'"
export const SELECT_CONDITION_OPTIONS: SelectCondition[] = [
  "'*'",
  "'#'",
  "'0'",
  "'1'",
  "'2'",
  "'3'",
  "'4'",
  "'5'",
  "'6'",
  "'7'",
  "'8'",
  "'9'",
]

export type UserfuncType =
  | ''
  | 'SO Library'
  | 'Java Script'
  | 'Python'
  | 'Shell Script'
export const USER_FUNC_TYPE_OPTIONS: EmptyString<UserfuncType>[] = [
  '\u00A0',
  'SO Library',
  'Java Script',
  'Python',
  'Shell Script',
]

export type Align = 'left' | 'mid' | 'right'
export const ALIGN_OPTIONS: Align[] = ['left', 'mid', 'right']

export type Trim = '' | 'left' | 'right' | 'all'
export const TRIM_OPTIONS: EmptyString<Trim>[] = [
  '\u00A0',
  'left',
  'right',
  'all',
]

export type DefinePacketEncode = '' | 'UTF-8'
export const DEFINE_PACKET_ENCODE_OPTIONS: EmptyString<DefinePacketEncode>[] = [
  '\u00A0',
  'UTF-8',
]

type SwitchMode = 'Half'
export const SWITCH_MODE_OPTIONS: SwitchMode[] = ['Half']

type DnGroupName = 'Voice' | 'Avail Channel'
export const DN_GROUP_NAME_OPTIONS: DnGroupName[] = ['Voice', 'Avail Channel']

type TypeID = '' | 'MT1' | 'MT2' | 'MT3' | 'MT4' | 'MT5'
export const TYPE_ID_OPTIONS: EmptyString<TypeID>[] = [
  '\u00A0',
  'MT1',
  'MT2',
  'MT3',
  'MT4',
  'MT5',
]

type DefineLogPeriod = 'day' | '5min' | '10min' | '30min' | '1hour' | '2hour'
export const DEFINE_LOG_PERIOD_OPTIONS: DefineLogPeriod[] = [
  'day',
  '5min',
  '10min',
  '30min',
  '1hour',
  '2hour',
]

type Consumer = '' | 'Normal' | 'Black Consumer'
export const CONSUMER_OPTIONS: EmptyString<Consumer>[] = [
  '\u00A0',
  'Normal',
  'Black Consumer',
]

type ScoreOptions100 =
  | '100'
  | '90'
  | '80'
  | '70'
  | '60'
  | '50'
  | '40'
  | '30'
  | '20'
  | '10'
export const SCORE_OPTIONS_100: ScoreOptions100[] = [
  '100',
  '90',
  '80',
  '70',
  '60',
  '50',
  '40',
  '30',
  '20',
  '10',
]

export const MAX_TIME_OPTIONS_300 = Array.from({ length: 30 }, (_, i) =>
  ((i + 1) * 10).toString(),
)

type RecordMode = 'Mono' | 'Stereo'
export const RECORD_MODE_OPTIONS: RecordMode[] = ['Mono', 'Stereo']

type ApplicationDownMethod = 'disconnect' | 'change service' | 'next'
export const APPLICATION_DOWN_METHOD_OPTIONS: ApplicationDownMethod[] = [
  'disconnect',
  'change service',
  'next',
]

type Threshold =
  | '0'
  | '10'
  | '20'
  | '30'
  | '40'
  | '50'
  | '60'
  | '70'
  | '80'
  | '90'
  | '100'
export const THRESHOLD_OPTIONS: Threshold[] = [
  '0',
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
  '100',
]

type Retry = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
export const RETRY_OPTIONS: Retry[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
]

type SkillLevel =
  | ''
  | 'session.call.routetype'
  | '최장대기'
  | '최소응답'
  | '최소응대시간'
  | 'Round Robin'
  | '누적 최장대기'
  | '큐 최소응답'
  | '큐 최소응대시간'
export const SKILL_LEVEL_OPTIONS: EmptyString<SkillLevel>[] = [
  '\u00A0',
  'session.call.routetype',
  '최장대기',
  '누적 최장대기',
  '최소응답',
  '큐 최소응답',
  '최소응대시간',
  '큐 최소응대시간',
  'Round Robin',
]

type BsrRouting = '' | '적용' | '미적용'
export const BSR_ROUTING_OPTIONS: EmptyString<BsrRouting>[] = [
  '\u00A0',
  '적용',
  '미적용',
]

type AcdKind = 'users' | 'phones' | 'group'
export const ACD_KIND_OPTIONS: AcdKind[] = ['users', 'phones', 'group']

type SetMent = '' | 'MentID' | 'TTS-KSC5601' | 'TTS-Stream' | 'TTS-File'
export const SET_MENT_OPTIONS: EmptyString<SetMent>[] = [
  '\u00A0',
  'MentID',
  'TTS-KSC5601',
  'TTS-Stream',
  'TTS-File',
]

type Dtmf =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0'
  | '*'
  | '#'
export const DTMF_OPTIONS: Dtmf[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  '*',
  '#',
]

type DtmfLength = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
export const DTMF_LENGTH_OPTIONS: DtmfLength[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]

type DelimeterType =
  | ''
  | ':'
  | ';'
  | ','
  | '.'
  | '/'
  | '|'
  | '-'
  | '='
  | '~'
  | '!'
  | '@'
  | '#'
  | '$'
  | '^'
  | '*'
  | '?'
export const DELIMETER_TYPE_OPTIONS: EmptyString<DelimeterType>[] = [
  '\u00A0',
  ':',
  ';',
  ',',
  '.',
  '/',
  '|',
  '-',
  '=',
  '~',
  '!',
  '@',
  '#',
  '$',
  '^',
  '*',
  '?',
]

type MenuReturn =
  | '0: 현재 메뉴항목 계속진행'
  | '1: 상위 메뉴로의 이동'
  | '2: 최상위 메뉴로 이동'
  | '3: 메뉴호출종료'
export const MENU_RETURN_OPTIONS: MenuReturn[] = [
  '0: 현재 메뉴항목 계속진행',
  '1: 상위 메뉴로의 이동',
  '2: 최상위 메뉴로 이동',
  '3: 메뉴호출종료',
]

type DetectType = 'Voice' | 'Machine'
export const DETECT_TYPE_OPTIONS: DetectType[] = ['Voice', 'Machine']

type DNISType = 'ANI' | 'DNIS' | 'User Data'
export const DNIS_OPTIONS: DNISType[] = ['ANI', 'DNIS', 'User Data']

type LogLevel = 'OFF' | 'ERR' | 'WRN' | 'INF' | 'LV1' | 'LV2' | 'LV3' | 'DBG'
export const LOG_LEVEL_OPTIONS: LogLevel[] = [
  'OFF',
  'ERR',
  'WRN',
  'INF',
  'LV1',
  'LV2',
  'LV3',
  'DBG',
]
