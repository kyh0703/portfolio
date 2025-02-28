import { cn } from '@/utils/cn'

type TabLabelProps = {
  label: string
  className?: string
  align?: 'left' | 'center' | 'right'
}

export default function TabLabel({
  label,
  className,
  align = 'center',
}: TabLabelProps) {
  return (
    <span
      className={cn(
        'grow overflow-hidden text-ellipsis text-nowrap font-medium text-gray-550',
        `text-${align}`,
        'dark:text-white',
        className,
      )}
      style={{
        textAlign: align,
      }}
    >
      {label}
    </span>
  )
}
