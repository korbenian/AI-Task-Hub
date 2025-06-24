import React from 'react'
import type { FC } from 'react'

interface InputProps {
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  name?: string
  className?: string
}

const Input: FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  className,
  placeholder,
  name
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      name={name}
    />
  )
}

export default Input
