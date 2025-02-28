'use client'

import { cn } from '@/utils'
import type { MiniMapNodeProps } from '@xyflow/react'

export function DefaultMiniMode({
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
}: MiniMapNodeProps) {
  const { background, backgroundColor } = style || {}
  const fill = (color || background || backgroundColor) as string

  return (
    <rect
      className={cn('react-flow__minimap-node', { selected }, className)}
      x={x}
      y={y}
      rx={borderRadius}
      ry={borderRadius}
      width={width}
      height={height}
      style={{
        fill,
        stroke: strokeColor,
        strokeWidth,
      }}
      shapeRendering={shapeRendering}
      onClick={onClick ? (event) => onClick(event, id) : undefined}
    />
  )
}
