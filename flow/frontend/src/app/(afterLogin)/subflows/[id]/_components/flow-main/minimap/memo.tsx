import { cn } from '@/utils'
import type { MiniMapNodeProps } from '@xyflow/react'

export function MemoMiniNode({
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
    <>
      <rect
        className={cn(
          'react-flow__minimap-node cursor-pointer',
          { selected },
          className,
        )}
        x={x}
        y={y}
        rx={borderRadius}
        ry={borderRadius}
        width={width}
        height={height}
        style={{
          cursor: 'pointer',
          fill: '#fffacd',
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: '5 5',
        }}
        shapeRendering={shapeRendering}
        onClick={onClick ? (event) => onClick(event, id) : undefined}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{ fill: 'black', fontSize: '12px' }}
      >
        {id}
      </text>
    </>
  )
}
