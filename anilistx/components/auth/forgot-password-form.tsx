'use client'

import { useState, FormEvent } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    // Basic validation
    if (!email) {
      setErrorMsg('Email is required')
      return
    }
    
    try {
      setIsLoading(true)
      setErrorMsg(null)
      setSuccessMsg(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('Password reset email sent. Check your inbox for further instructions.')
        setEmail('')
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Password Reset</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive password reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {errorMsg && (
          <Alert className="mb-6 bg-red-50 text-red-800 border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        
        {successMsg && (
          <Alert className="mb-6 bg-green-50 text-green-800 border border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com" 
                className="pl-10" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : null}
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-gray-500">
          Remember your password?{' '}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Back to login
          </a>
        </p>
      </CardFooter>
    </Card>
  )
} 