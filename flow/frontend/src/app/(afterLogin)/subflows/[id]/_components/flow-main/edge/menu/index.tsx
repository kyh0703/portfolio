import {
  useReactFlow,
  type AppEdge,
  type AppNode,
  type Connection,
} from '@xyflow/react'
import ContextMenu from '../../../../../../../_components/context-menu'
import { edgeMenuComponents, type EdgeMenuComponentKey } from './types'

export type EdgeMenuProps = {
  connection: Connection
  mouse: {
    x: number
    y: number
  }
  onClick?: () => void
}

export default function EdgeMenu({ connection, ...props }: EdgeMenuProps) {
  const { getNode } = useReactFlow<AppNode, AppEdge>()
  const sourceNode = getNode(connection.source!)!
  const targetNode = getNode(connection.target!)!

  const EdgeMenuComponent =
    edgeMenuComponents[sourceNode.type as EdgeMenuComponentKey]
  if (!EdgeMenuComponent) {
    return null
  }

  return (
    <ContextMenu
      left={props.mouse.x}
      top={props.mouse.y}
      onClick={props.onClick}
    >
      <EdgeMenuComponent
        connection={connection}
        sourceNode={sourceNode}
        targetNode={targetNode}
      />
    </ContextMenu>
  )
}
