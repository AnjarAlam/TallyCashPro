import * as React from "react"

// Minimal type definitions used by `use-toast.ts`.
// These are intentionally lightweight — expand if you rely on more fields.
export type ToastActionElement = React.ReactNode

export type ToastProps = {
  id?: string
  open?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  onOpenChange?: (open: boolean) => void
  [key: string]: any
}

export {}
