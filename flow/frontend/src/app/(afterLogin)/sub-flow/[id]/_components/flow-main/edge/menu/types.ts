import type { AppNode, Connection } from '@xyflow/react'
import { DBQueryMenu } from './db-query-menu'
import { GetDigitMenu } from './get-digit-menu'
import { IfMenu } from './if-menu'
import { PacketCallMenu } from './packet-call-menu'
import { PacketJsonMenu } from './packet-json-menu'
import { PlayMenu } from './play-menu'
import { SelectMenu } from './select-menu'
import { NLURequestMenu } from './nlu-request-menu'
import { IntentCallMenu } from './intent-call-menu'
import { EntityCallMenu } from './entity-call-menu'

export type EdgeMenuComponentProps = {
  connection: Connection
  sourceNode: AppNode
  targetNode: AppNode
}

export const edgeMenuComponents = {
  DBQuery: DBQueryMenu,
  GetDigit: GetDigitMenu,
  If: IfMenu,
  PacketCall: PacketCallMenu,
  PacketJson: PacketJsonMenu,
  Play: PlayMenu,
  Select: SelectMenu,
  NLURequest: NLURequestMenu,
  IntentCall: IntentCallMenu,
  EntityCall: EntityCallMenu,
}

export type EdgeMenuComponentKey = keyof typeof edgeMenuComponents
