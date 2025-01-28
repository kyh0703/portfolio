import { Handle, useHandleConnections, type HandleProps } from '@xyflow/react'

type LimitHandleProps = {
  connectionCount: number
} & HandleProps

export function LimitHandle(props: LimitHandleProps) {
  const connections = useHandleConnections({
    type: props.type,
  })

  return (
    <Handle
      {...props}
      isConnectable={connections.length < props.connectionCount}
    />
  )
}
