'use client'

import {
  AbortIcon,
  AssignIcon,
  CdrCallIcon,
  CdrCtrlIcon,
  CdrIcon,
  ChangeServiceIcon,
  ChoiceCallIcon,
  ChoiceMentIcon,
  CloseVRIcon,
  ConsumerMonitIcon,
  CtiCallIcon,
  DBQueryIcon,
  DisconnectIcon,
  DisconnectWebIcon,
  DisSwitchIcon,
  EntityCallIcon,
  GetChannelIcon,
  GetDigitIcon,
  GetPageDataIcon,
  GotoLabelIcon,
  IfIcon,
  IntentCallIcon,
  LogWriteIcon,
  MakeCallIcon,
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
  StartIcon,
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
import { useNodeDimensions } from '@/hooks/xyflow'
import { useSubFlowStore } from '@/store/flow'
import { cn } from '@/utils/cn'
import {
  Handle,
  Position,
  useStore,
  type CustomNodeProps,
  type ReactFlowState,
} from '@xyflow/react'
import { BookmarkCheckIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import { useShallow } from 'zustand/react/shallow'

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connection.fromHandle?.nodeId

const withNodeIconStyle = (
  Icon: ComponentType<IconButtonProps>,
): ComponentType<CustomNodeProps> => {
  const WithIcon = ({ id, selected, data }: CustomNodeProps) => {
    const editMode = useSubFlowStore(useShallow((state) => state.editMode))
    const { desc } = data
    const { width, height } = useNodeDimensions(id)
    const connectionNodeId = useStore(connectionNodeIdSelector)
    const isConnecting = !!connectionNodeId
    const isTarget = connectionNodeId && connectionNodeId !== id
    const targetHandleStyle = { zIndex: isTarget ? 3 : 1 }

    return (
      <div
        className={cn(
          'relative cursor-pointer outline-none',
          selected && 'outline-dashed',
        )}
        style={{ width, height }}
      >
        <div
          className={cn(
            'absolute',
            'flex items-center justify-center',
            'h-full w-full',
            'left-1/2 top-1/2',
            'z-[1] rounded-2xl',
            '-translate-x-1/2 -translate-y-1/2 transform',
          )}
        >
          {!isConnecting && (
            <Handle
              className="node-handle"
              style={{ zIndex: 2 }}
              position={Position.Right}
              type="source"
            />
          )}
          <Handle
            className="node-handle"
            style={targetHandleStyle}
            position={Position.Left}
            type="target"
            isConnectable={true}
          />
        </div>
        <div
          className={cn(
            'absolute left-0 top-0',
            'flex flex-col items-center justify-center',
            'h-full w-full',
            editMode === 'grab' && 'z-10',
          )}
        >
          <Icon width={width} height={height} />
        </div>
        <div
          className="pointer-events-none absolute left-1/2 flex w-max max-w-[90px] -translate-x-1/2 transform flex-col items-center justify-center gap-1"
          style={{ top: height + 4 }}
        >
          <span className="whitespace-nowrap text-xxs font-bold">{id}</span>
          <p className="line-clamp-3 break-all text-center text-bs">{desc}</p>
        </div>
      </div>
    )
  }

  return WithIcon
}

// ai
export const EntityCallNode = withNodeIconStyle(EntityCallIcon)
export const IntentCallNode = withNodeIconStyle(IntentCallIcon)
export const NLURequestNode = withNodeIconStyle(NLURequestIcon)
// db
export const DBQueryNode = withNodeIconStyle(DBQueryIcon)
// etc
export const StartNode = withNodeIconStyle(StartIcon)
// event
export const SetEventNode = withNodeIconStyle(SetEventIcon)
export const WaitEventNode = withNodeIconStyle(WaitEventIcon)
// flow
export const AssignNode = withNodeIconStyle(AssignIcon)
export const CdrCallNode = withNodeIconStyle(CdrCallIcon)
export const CdrCtrlNode = withNodeIconStyle(CdrCtrlIcon)
export const CdrNode = withNodeIconStyle(CdrIcon)
export const ChangeServiceNode = withNodeIconStyle(ChangeServiceIcon)
export const GoToLabelNode = withNodeIconStyle(GotoLabelIcon)
export const IfNode = withNodeIconStyle(IfIcon)
export const MenuCallNode = withNodeIconStyle(MenuCallIcon)
export const MenuChangeNode = withNodeIconStyle(MenuChangeIcon)
export const MenuReturnNode = withNodeIconStyle(MenuReturnIcon)
export const ReturnNode = withNodeIconStyle(ReturnIcon)
export const SelectNode = withNodeIconStyle(SelectIcon)
export const SetLabelNode = withNodeIconStyle(SetLabelIcon)
export const SleepNode = withNodeIconStyle(SleepIcon)
export const StringParserNode = withNodeIconStyle(StringParserIcon)
export const SubCallNode = withNodeIconStyle(SubCallIcon)
export const UserEnvNode = withNodeIconStyle(UserEnvIcon)
// iweb
export const DisconnectWebNode = withNodeIconStyle(DisconnectWebIcon)
export const GetPageDataNode = withNodeIconStyle(GetPageDataIcon)
export const RegistServerNode = withNodeIconStyle(RegistServerIcon)
export const RequestPageNode = withNodeIconStyle(RequestPageIcon)
export const UnregistServerNode = withNodeIconStyle(UnregistServerIcon)
export const WaitWebInboundNode = withNodeIconStyle(WaitWebInboundIcon)
// log
export const LogWriteNode = withNodeIconStyle(LogWriteIcon)
// packet
export const PacketCallNode = withNodeIconStyle(PacketCallIcon)
export const PacketJsonNode = withNodeIconStyle(PacketJsonIcon)
export const PacketSizeNode = withNodeIconStyle(PacketSizeIcon)
export const RequestHTTPNode = withNodeIconStyle(RequestHTTPIcon)
// route
export const RouteACDNode = withNodeIconStyle(RouteACDIcon)
export const RouteGroupNode = withNodeIconStyle(RouteGroupIcon)
export const RouteQueueRuleNode = withNodeIconStyle(RouteQueueRuleIcon)
export const RouteSkillGroupNode = withNodeIconStyle(RouteSkillGroupIcon)
export const RouteSkillNode = withNodeIconStyle(RouteSkillIcon)
export const UserDataNode = withNodeIconStyle(UserDataIcon)
// telephony
export const AbortNode = withNodeIconStyle(AbortIcon)
export const ChoiceCallNode = withNodeIconStyle(ChoiceCallIcon)
export const ChoiceMentNode = withNodeIconStyle(ChoiceMentIcon)
export const CtiCallNode = withNodeIconStyle(CtiCallIcon)
export const DisconnectNode = withNodeIconStyle(DisconnectIcon)
export const DisSwitchNode = withNodeIconStyle(DisSwitchIcon)
export const GetChannelNode = withNodeIconStyle(GetChannelIcon)
export const GetDigitNode = withNodeIconStyle(GetDigitIcon)
export const MakeCallNode = withNodeIconStyle(MakeCallIcon)
export const PlayNode = withNodeIconStyle(PlayIcon)
export const PushToneNode = withNodeIconStyle(PushToneIcon)
export const RecordNode = withNodeIconStyle(RecordIcon)
export const SwitchNode = withNodeIconStyle(SwitchIcon)
export const ToneDetectNode = withNodeIconStyle(ToneDetectIcon)
export const TransferNode = withNodeIconStyle(TransferIcon)
export const WaitInboundNode = withNodeIconStyle(WaitInboundIcon)
export const WaitOutboundNode = withNodeIconStyle(WaitOutboundIcon)
// tracking
export const ConsumerMonitNode = withNodeIconStyle(ConsumerMonitIcon)
export const TrackingNode = withNodeIconStyle(TrackingIcon)
export const UserMenuStatNode = withNodeIconStyle(UserMenuStatIcon)
// userfunc
export const UserFuncCallNode = withNodeIconStyle(UserFuncCallIcon)
// vr
export const CloseVRNode = withNodeIconStyle(CloseVRIcon)
export const OpenVRNode = withNodeIconStyle(OpenVRIcon)
export const RequestVRNode = withNodeIconStyle(RequestVRIcon)
export const ResponseVRNode = withNodeIconStyle(ResponseVRIcon)
export const VoiceRecognizeNode = withNodeIconStyle(VoiceRecognizeIcon)
