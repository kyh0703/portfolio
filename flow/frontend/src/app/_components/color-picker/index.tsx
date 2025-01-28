'use client'

import React, { useRef, type MouseEventHandler } from 'react'

type ColorPickerProps = {
  icon: React.ReactNode
  onChange?: React.ChangeEventHandler<HTMLInputElement>
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'>

export default function ColorPicker({
  id,
  value,
  disabled,
  checked,
  icon,
  onChange,
  ...rest
}: ColorPickerProps) {
  const ref = useRef<HTMLInputElement>(null)

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    ref.current?.click()
  }

  return (
    <div onClick={handleClick}>
      <input
        className="absolute -z-10 opacity-0"
        {...rest}
        ref={ref}
        value={value}
        type="color"
        readOnly={!onChange}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
      />
      {icon}
    </div>
  )
}
