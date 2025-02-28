import { EntityCall } from '@/app/_components/icon/commands/ai/entity-call'
import { IntentCall } from '@/app/_components/icon/commands/ai/intent-call'
import { NLURequest } from '@/app/_components/icon/commands/ai/nlu-request'
import { DBQuery } from '@/app/_components/icon/commands/db/db-query'
import { SetEvent } from '@/app/_components/icon/commands/event/set-event'
import { WaitEvent } from '@/app/_components/icon/commands/event/wait-event'
import { Assign } from '@/app/_components/icon/commands/flow/assign'
import { Cdr } from '@/app/_components/icon/commands/flow/cdr'
import { CdrCall } from '@/app/_components/icon/commands/flow/cdr-call'
import { CdrCtrl } from '@/app/_components/icon/commands/flow/cdr-ctrl'
import { ChangeService } from '@/app/_components/icon/commands/flow/change-service'
import { GotoLabel } from '@/app/_components/icon/commands/flow/goto-label'
import { If } from '@/app/_components/icon/commands/flow/if'
import { MenuCall } from '@/app/_components/icon/commands/flow/menu-call'
import { MenuChange } from '@/app/_components/icon/commands/flow/menu-change'
import { MenuReturn } from '@/app/_components/icon/commands/flow/menu-return'
import { Return } from '@/app/_components/icon/commands/flow/return'
import { Select } from '@/app/_components/icon/commands/flow/select'
import { SetLabel } from '@/app/_components/icon/commands/flow/set-label'
import { Sleep } from '@/app/_components/icon/commands/flow/sleep'
import { Start } from '@/app/_components/icon/commands/flow/start'
import { StringParser } from '@/app/_components/icon/commands/flow/string-parser'
import { SubCall } from '@/app/_components/icon/commands/flow/sub-call'
import { UserEnv } from '@/app/_components/icon/commands/flow/user-env'
import { DisconnectWeb } from '@/app/_components/icon/commands/iweb/disconnect-web'
import { GetPageData } from '@/app/_components/icon/commands/iweb/get-page-data'
import { RegistServer } from '@/app/_components/icon/commands/iweb/regist-server'
import { RequestPage } from '@/app/_components/icon/commands/iweb/request-page'
import { UnregistServer } from '@/app/_components/icon/commands/iweb/unregist-server'
import { WaitWebInbound } from '@/app/_components/icon/commands/iweb/wait-web-inbound'
import { LogWrite } from '@/app/_components/icon/commands/log/log-write'
import { PacketCall } from '@/app/_components/icon/commands/packet/packet-call'
import { PacketJson } from '@/app/_components/icon/commands/packet/packet-json'
import { PacketSize } from '@/app/_components/icon/commands/packet/packet-size'
import { RequestHttp } from '@/app/_components/icon/commands/packet/request-http'
import { RouteAcd } from '@/app/_components/icon/commands/route/route-acd'
import { RouteGroup } from '@/app/_components/icon/commands/route/route-group'
import { RouteQueueRule } from '@/app/_components/icon/commands/route/route-queue-rule'
import { RouteSkill } from '@/app/_components/icon/commands/route/route-skill'
import { RouteSkillGroup } from '@/app/_components/icon/commands/route/route-skill-group'
import { UserData } from '@/app/_components/icon/commands/route/user-data'
import { Abort } from '@/app/_components/icon/commands/telephony/abort'
import { ChoiceCall } from '@/app/_components/icon/commands/telephony/choice-call'
import { ChoiceMent } from '@/app/_components/icon/commands/telephony/choice-ment'
import { CtiCall } from '@/app/_components/icon/commands/telephony/cti-call'
import { Disconnect } from '@/app/_components/icon/commands/telephony/disconnect'
import { DisSwitch } from '@/app/_components/icon/commands/telephony/disswitch'
import { GetChannel } from '@/app/_components/icon/commands/telephony/get-channel'
import { GetDigit } from '@/app/_components/icon/commands/telephony/get-digit'
import { MakeCall } from '@/app/_components/icon/commands/telephony/make-call'
import { Play } from '@/app/_components/icon/commands/telephony/play'
import { PushTone } from '@/app/_components/icon/commands/telephony/push-tone'
import { Record } from '@/app/_components/icon/commands/telephony/record'
import { Switch } from '@/app/_components/icon/commands/telephony/switch'
import { ToneDetect } from '@/app/_components/icon/commands/telephony/tone-detect'
import { Transfer } from '@/app/_components/icon/commands/telephony/transfer'
import { WaitInbound } from '@/app/_components/icon/commands/telephony/wait-inbound'
import { WaitOutbound } from '@/app/_components/icon/commands/telephony/wait-outbound'
import { ConsumerMonit } from '@/app/_components/icon/commands/tracking/consumer-monit'
import { Tracking } from '@/app/_components/icon/commands/tracking/tracking'
import { UserMenuStat } from '@/app/_components/icon/commands/tracking/user-menu-stat'
import { UserFuncCall } from '@/app/_components/icon/commands/userfunc/user-func-call'
import { CloseVR } from '@/app/_components/icon/commands/vr/close-vr'
import { OpenVR } from '@/app/_components/icon/commands/vr/open-vr'
import { RequestVR } from '@/app/_components/icon/commands/vr/request-vr'
import { ResponseVR } from '@/app/_components/icon/commands/vr/response-vr'
import { VoiceRecognize } from '@/app/_components/icon/commands/vr/voice-recognize'
import { cn } from '@/utils'
import { type MiniMapNodeProps } from '@xyflow/react'

function withSvg(
  children: React.ReactNode,
): React.ComponentType<MiniMapNodeProps> {
  const withPath = ({
    id,
    x,
    y,
    width,
    height,
    style,
    color,
    strokeColor,
    strokeWidth,
    className,
    borderRadius,
    shapeRendering,
    selected,
    onClick,
  }: MiniMapNodeProps) => {
    return (
      <svg
        className={cn('react-flow__minimap-node', { selected }, className)}
        viewBox="0 0 40 40"
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          cursor: 'pointer',
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        onClick={onClick ? (event) => onClick(event, id) : undefined}
      >
        {children}
      </svg>
    )
  }

  return withPath
}

export const EntityCallMiniNode = withSvg(<EntityCall />)
export const IntentCallMiniNode = withSvg(<IntentCall />)
export const NLURequestMiniNode = withSvg(<NLURequest />)
// database
export const DBQueryMiniNode = withSvg(<DBQuery />)
// event
export const SetEventMiniNode = withSvg(<SetEvent />)
export const WaitEventMiniNode = withSvg(<WaitEvent />)
// flow
export const AssignMiniNode = withSvg(<Assign />)
export const ChangeServiceMiniNode = withSvg(<ChangeService />)
export const GotoLabelMiniNode = withSvg(<GotoLabel />)
export const IfMiniNode = withSvg(<If />)
export const MenuCallMiniNode = withSvg(<MenuCall />)
export const MenuChangeMiniNode = withSvg(<MenuChange />)
export const MenuReturnMiniNode = withSvg(<MenuReturn />)
export const CdrMiniNode = withSvg(<Cdr />)
export const CdrCtrlMiniNode = withSvg(<CdrCtrl />)
export const CdrCallMiniNode = withSvg(<CdrCall />)
export const ReturnMiniNode = withSvg(<Return />)
export const SelectMiniNode = withSvg(<Select />)
export const SetLabelMiniNode = withSvg(<SetLabel />)
export const SleepMiniNode = withSvg(<Sleep />)
export const StartMiniNode = withSvg(<Start />)
export const StringParserMiniNode = withSvg(<StringParser />)
export const SubCallMiniNode = withSvg(<SubCall />)
export const UserEnvMiniNode = withSvg(<UserEnv />)
// iweb
export const DisconnectWebMiniNode = withSvg(<DisconnectWeb />)
export const GetPageDataMiniNode = withSvg(<GetPageData />)
export const RegistServerMiniNode = withSvg(<RegistServer />)
export const RequestPageMiniNode = withSvg(<RequestPage />)
export const UnregistServerMiniNode = withSvg(<UnregistServer />)
export const WaitWebInboundMiniNode = withSvg(<WaitWebInbound />)
// log
export const LogWriteMiniNode = withSvg(<LogWrite />)
// packet
export const PacketCallMiniNode = withSvg(<PacketCall />)
export const PacketJsonMiniNode = withSvg(<PacketJson />)
export const PacketSizeMiniNode = withSvg(<PacketSize />)
export const RequestHTTPMiniNode = withSvg(<RequestHttp />)
// route
export const RouteACDMiniNode = withSvg(<RouteAcd />)
export const RouteGroupMiniNode = withSvg(<RouteGroup />)
export const RouteQueueRuleMiniNode = withSvg(<RouteQueueRule />)
export const RouteSkillMiniNode = withSvg(<RouteSkill />)
export const RouteSkillGroupMiniNode = withSvg(<RouteSkillGroup />)
export const UserDataMiniNode = withSvg(<UserData />)
// telephony
export const AbortMiniNode = withSvg(<Abort />)
export const ChoiceCallMiniNode = withSvg(<ChoiceCall />)
export const ChoiceMentMiniNode = withSvg(<ChoiceMent />)
export const CtiCallMiniNode = withSvg(<CtiCall />)
export const DisconnectMiniNode = withSvg(<Disconnect />)
export const DisSwitchMiniNode = withSvg(<DisSwitch />)
export const GetChannelMiniNode = withSvg(<GetChannel />)
export const GetDigitMiniNode = withSvg(<GetDigit />)
export const MakeCallMiniNode = withSvg(<MakeCall />)
export const PlayMiniNode = withSvg(<Play />)
export const PushToneMiniNode = withSvg(<PushTone />)
export const RecordMiniNode = withSvg(<Record />)
export const SwitchMiniNode = withSvg(<Switch />)
export const ToneDetectMiniNode = withSvg(<ToneDetect />)
export const TransferMiniNode = withSvg(<Transfer />)
export const WaitInboundMiniNode = withSvg(<WaitInbound />)
export const WaitOutboundMiniNode = withSvg(<WaitOutbound />)
// tracking
export const ConsumerMonitMiniNode = withSvg(<ConsumerMonit />)
export const TrackingMiniNode = withSvg(<Tracking />)
export const UserMenuStatMiniNode = withSvg(<UserMenuStat />)
// userfunction
export const UserFuncCallMiniNode = withSvg(<UserFuncCall />)
// vr
export const CloseVRMiniNode = withSvg(<CloseVR />)
export const OpenVRMiniNode = withSvg(<OpenVR />)
export const RequestVRMiniNode = withSvg(<RequestVR />)
export const ResponseVRMiniNode = withSvg(<ResponseVR />)
export const VoiceRecognizeMiniNode = withSvg(<VoiceRecognize />)
