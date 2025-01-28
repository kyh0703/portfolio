'use client'

import { ConnectionLineComponentProps, getStraightPath } from '@xyflow/react'

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  })

  return (
    <g>
      <path className="stroke-foreground stroke-1" d={edgePath} fill="none" />
      <circle
        className="stroke-foreground stroke-1"
        cx={toX}
        cy={toY}
        r={3}
        strokeWidth={1.5}
      />
    </g>
  )
}
