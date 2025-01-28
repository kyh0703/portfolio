'use client'

import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import { useTheme } from 'next-themes'
import { forwardRef, type KeyboardEvent } from 'react'

export type GridProps = {
  width?: number | string
  height?: number | string
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
} & AgGridReactProps

const Grid = forwardRef<AgGridReact, GridProps>(
  ({ width = '100%', height = '100%', rowData, onKeyDown, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        className={
          theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'
        }
        onKeyDown={onKeyDown}
      >
        <AgGridReact ref={ref} rowData={rowData} {...props} />
      </div>
    )
  },
)

Grid.displayName = 'Grid'
export default Grid
