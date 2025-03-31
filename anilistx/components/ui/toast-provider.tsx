"use client"

import React, { createContext } from 'react'
import { type ToastProps, ToastProvider as ToastHookProvider } from './use-toast'

type ToastContextType = {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
  toasts: Array<ToastProps & { id: string }>
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastHook = ToastHookProvider({ children })
  
  return (
    <ToastContext.Provider value={toastHook}>
      {children}
    </ToastContext.Provider>
  )
} 