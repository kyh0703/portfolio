import {
  type CSSProperties,
  type ElementType,
  type PropsWithChildren,
} from 'react'

type TabPanelProps = {
  activeTab: any
  value: any
  className?: string
  as?: ElementType
  style?: CSSProperties
} & PropsWithChildren

export const TabPanel = ({
  children,
  activeTab,
  value,
  className = '',
  style,
  ...props
}: TabPanelProps) => {
  return (
    <>
      {activeTab === value && (
        <div className="flex h-full w-full overflow-auto" {...props}>
          {children}
        </div>
      )}
    </>
  )
}
