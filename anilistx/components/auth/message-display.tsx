'use client'

import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MessageDisplay() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const error = searchParams.get('error')

  if (!message && !error) return null

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (message) {
    return (
      <Alert variant="success" className="mb-6">
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  return null
} 