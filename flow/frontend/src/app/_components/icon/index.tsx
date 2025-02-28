'use client'

import { cn } from '@/utils'
import type React from 'react'

export type IconButtonProps = {
  width?: number
  height?: number
  size?: number
  className?: string
  color?: string
  backgroundColor?: string
  disabled?: boolean
  cursor?: string
  onClick?: React.MouseEventHandler<SVGSVGElement>
}

function withIconStyle(
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
): React.ComponentType<IconButtonProps> {
  const IconWithStyle = ({
    className,
    size = 24,
    width,
    height,
    cursor,
    disabled,
    onClick,
    color,
    backgroundColor,
    ...rest
  }: IconButtonProps) => {
    const cur = cursor ? cursor : onClick ? 'pointer' : ''

    return (
      <div
        style={{
          width: `${width ? width : size}px`,
          height: `${height ? height : size}px`,
          fontSize: `${width && height ? (width + height) / 2 : size}px`,
          backgroundColor: backgroundColor,
          color: color,
          cursor: disabled ? 'none' : cur,
          opacity: disabled ? 0.1 : 1,
        }}
        className={cn('flex items-center justify-center', className)}
        {...rest}
      >
        <Icon
          fontSize="inherit"
          color="inherit"
          onClick={onClick as React.MouseEventHandler<SVGSVGElement>}
        />
      </div>
    )
  }

  return IconWithStyle
}



export * from './commands'
