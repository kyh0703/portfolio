import { cn } from '@/utils'
import type { IconButtonProps } from '..'
import { EntityCall } from './ai/entity-call'
import { IntentCall } from './ai/intent-call'
import { NLURequest } from './ai/nlu-request'
import { DBQuery } from './db/db-query'
import { Group } from './etc/group'
import { Memo } from './etc/memo'
import { SetEvent } from './event/set-event'
import { WaitEvent } from './event/wait-event'
import { Assign } from './flow/assign'
import { Cdr } from './flow/cdr'
import { CdrCall } from './flow/cdr-call'
import { CdrCtrl } from './flow/cdr-ctrl'
import { ChangeService } from './flow/change-service'
import { GotoLabel } from './flow/goto-label'
import { If } from './flow/if'
import { MenuCall } from './flow/menu-call'
import { MenuChange } from './flow/menu-change'
import { MenuReturn } from './flow/menu-return'
import { Return } from './flow/return'
import { Select } from './flow/select'
import { SetLabel } from './flow/set-label'
import { Sleep } from './flow/sleep'
import { Start } from './flow/start'
import { StringParser } from './flow/string-parser'
import { SubCall } from './flow/sub-call'
import { UserEnv } from './flow/user-env'
import { DisconnectWeb } from './iweb/disconnect-web'
import { GetPageData } from './iweb/get-page-data'
import { RegistServer } from './iweb/regist-server'
import { RequestPage } from './iweb/request-page'
import { UnregistServer } from './iweb/unregist-server'
import { WaitWebInbound } from './iweb/wait-web-inbound'
import { LogWrite } from './log/log-write'
import { PacketCall } from './packet/packet-call'
import { PacketJson } from './packet/packet-json'
import { PacketSize } from './packet/packet-size'
import { RequestHttp } from './packet/request-http'
import { RouteAcd } from './route/route-acd'
import { RouteGroup } from './route/route-group'
import { RouteQueueRule } from './route/route-queue-rule'
import { RouteSkill } from './route/route-skill'
import { RouteSkillGroup } from './route/route-skill-group'
import { UserData } from './route/user-data'
import { Abort } from './telephony/abort'
import { ChoiceCall } from './telephony/choice-call'
import { ChoiceMent } from './telephony/choice-ment'
import { CtiCall } from './telephony/cti-call'
import { Disconnect } from './telephony/disconnect'
import { DisSwitch } from './telephony/disswitch'
import { GetChannel } from './telephony/get-channel'
import { GetDigit } from './telephony/get-digit'
import { MakeCall } from './telephony/make-call'
import { Play } from './telephony/play'
import { PushTone } from './telephony/push-tone'
import { Record } from './telephony/record'
import { Switch } from './telephony/switch'
import { ToneDetect } from './telephony/tone-detect'
import { Transfer } from './telephony/transfer'
import { WaitInbound } from './telephony/wait-inbound'
import { WaitOutbound } from './telephony/wait-outbound'
import { ConsumerMonit } from './tracking/consumer-monit'
import { Tracking } from './tracking/tracking'
import { UserMenuStat } from './tracking/user-menu-stat'
import { UserFuncCall } from './userfunc/user-func-call'
import { CloseVR } from './vr/close-vr'
import { OpenVR } from './vr/open-vr'
import { RequestVR } from './vr/request-vr'
import { ResponseVR } from './vr/response-vr'
import { VoiceRecognize } from './vr/voice-recognize'

function withIconStyle(
  children: React.ReactNode,
): React.ComponentType<IconButtonProps> {
  const withPath = ({
    className,
    width = 24,
    height = 24,
    cursor,
    disabled,
    color,
    backgroundColor,
    onClick,
    ...props
  }: IconButtonProps) => {
    const cur = cursor ? cursor : onClick ? 'pointer' : ''
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          fontSize: `${(width + height) / 2}px`,
          backgroundColor: backgroundColor,
          color: color,
          cursor: disabled ? 'none' : cur,
          opacity: disabled ? 0.1 : 1,
        }}
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {children}
        </svg>
      </div>
    )
  }

  return withPath
}

export const EntityCallIcon = withIconStyle(<EntityCall />)
export const IntentCallIcon = withIconStyle(<IntentCall />)
export const NLURequestIcon = withIconStyle(<NLURequest />)
// database
export const DBQueryIcon = withIconStyle(<DBQuery />)
// etc
export const MemoIcon = withIconStyle(<Memo />)
export const GroupIcon = withIconStyle(<Group />)
// event
export const SetEventIcon = withIconStyle(<SetEvent />)
export const WaitEventIcon = withIconStyle(<WaitEvent />)
// flow
export const AssignIcon = withIconStyle(<Assign />)
export const ChangeServiceIcon = withIconStyle(<ChangeService />)
export const GotoLabelIcon = withIconStyle(<GotoLabel />)
export const IfIcon = withIconStyle(<If />)
export const MenuCallIcon = withIconStyle(<MenuCall />)
export const MenuChangeIcon = withIconStyle(<MenuChange />)
export const MenuReturnIcon = withIconStyle(<MenuReturn />)
export const CdrIcon = withIconStyle(<Cdr />)
export const CdrCtrlIcon = withIconStyle(<CdrCtrl />)
export const CdrCallIcon = withIconStyle(<CdrCall />)
export const ReturnIcon = withIconStyle(<Return />)
export const SelectIcon = withIconStyle(<Select />)
export const SetLabelIcon = withIconStyle(<SetLabel />)
export const SleepIcon = withIconStyle(<Sleep />)
export const StartIcon = withIconStyle(<Start />)
export const StringParserIcon = withIconStyle(<StringParser />)
export const SubCallIcon = withIconStyle(<SubCall />)
export const UserEnvIcon = withIconStyle(<UserEnv />)
// iweb
export const DisconnectWebIcon = withIconStyle(<DisconnectWeb />)
export const GetPageDataIcon = withIconStyle(<GetPageData />)
export const RegistServerIcon = withIconStyle(<RegistServer />)
export const RequestPageIcon = withIconStyle(<RequestPage />)
export const UnregistServerIcon = withIconStyle(<UnregistServer />)
export const WaitWebInboundIcon = withIconStyle(<WaitWebInbound />)
// log
export const LogWriteIcon = withIconStyle(<LogWrite />)
// packet
export const PacketCallIcon = withIconStyle(<PacketCall />)
export const PacketJsonIcon = withIconStyle(<PacketJson />)
export const PacketSizeIcon = withIconStyle(<PacketSize />)
export const RequestHTTPIcon = withIconStyle(<RequestHttp />)
// route
export const RouteACDIcon = withIconStyle(<RouteAcd />)
export const RouteGroupIcon = withIconStyle(<RouteGroup />)
export const RouteQueueRuleIcon = withIconStyle(<RouteQueueRule />)
export const RouteSkillIcon = withIconStyle(<RouteSkill />)
export const RouteSkillGroupIcon = withIconStyle(<RouteSkillGroup />)
export const UserDataIcon = withIconStyle(<UserData />)
// telephony
export const AbortIcon = withIconStyle(<Abort />)
export const ChoiceCallIcon = withIconStyle(<ChoiceCall />)
export const ChoiceMentIcon = withIconStyle(<ChoiceMent />)
export const CtiCallIcon = withIconStyle(<CtiCall />)
export const DisconnectIcon = withIconStyle(<Disconnect />)
export const DisSwitchIcon = withIconStyle(<DisSwitch />)
export const GetChannelIcon = withIconStyle(<GetChannel />)
export const GetDigitIcon = withIconStyle(<GetDigit />)
export const MakeCallIcon = withIconStyle(<MakeCall />)
export const PlayIcon = withIconStyle(<Play />)
export const PushToneIcon = withIconStyle(<PushTone />)
export const RecordIcon = withIconStyle(<Record />)
export const SwitchIcon = withIconStyle(<Switch />)
export const ToneDetectIcon = withIconStyle(<ToneDetect />)
export const TransferIcon = withIconStyle(<Transfer />)
export const WaitInboundIcon = withIconStyle(<WaitInbound />)
export const WaitOutboundIcon = withIconStyle(<WaitOutbound />)
// tracking
export const ConsumerMonitIcon = withIconStyle(<ConsumerMonit />)
export const TrackingIcon = withIconStyle(<Tracking />)
export const UserMenuStatIcon = withIconStyle(<UserMenuStat />)
// userfunction
export const UserFuncCallIcon = withIconStyle(<UserFuncCall />)
// vr
export const CloseVRIcon = withIconStyle(<CloseVR />)
export const OpenVRIcon = withIconStyle(<OpenVR />)
export const RequestVRIcon = withIconStyle(<RequestVR />)
export const ResponseVRIcon = withIconStyle(<ResponseVR />)
export const VoiceRecognizeIcon = withIconStyle(<VoiceRecognize />)
