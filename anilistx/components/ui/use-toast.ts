// Adapted from shadcn/ui toast component
import { useState, useEffect, createContext, useContext } from 'react'

const TOAST_TIMEOUT = 5000 // 5 seconds

export type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

type ToastContextType = {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
  toasts: Array<ToastProps & { id: string }>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { ...props, id }])

    // Auto dismiss after timeout
    setTimeout(() => {
      dismiss(id)
    }, TOAST_TIMEOUT)

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const value = {
    toast,
    dismiss,
    toasts,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
} 