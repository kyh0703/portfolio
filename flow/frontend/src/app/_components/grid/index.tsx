'use client'

import { cn } from '@/utils'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import { useTheme } from 'next-themes'
import { forwardRef, type KeyboardEvent } from 'react'

export type GridProps = {
  width?: number | string
  height?: number | string
  className?: string
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
} & AgGridReactProps

const Grid = forwardRef<AgGridReact, GridProps>(
  (
    {
      width = '100%',
      height = '100%',
      className,
      rowData,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme()
    console.log('className', className)

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        className={
          resolvedTheme === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'
        }
        onKeyDown={onKeyDown}
      >
        <AgGridReact
          ref={ref}
          className={cn(className)}
          rowData={rowData}
          {...props}
        />
      </div>
    )
  },
)

Grid.displayName = 'Grid'
export default Grid
