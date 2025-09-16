"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--earth-surface-elevated)",
          "--normal-text": "var(--earth-text)",
          "--normal-border": "var(--earth-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
