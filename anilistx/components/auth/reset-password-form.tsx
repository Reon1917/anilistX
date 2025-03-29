'use client'

import { useState, FormEvent } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    // Basic validation
    if (!password) {
      setErrorMsg('Password is required')
      return
    }
    
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters')
      return
    }

    if (password !== passwordConfirm) {
      setErrorMsg('Passwords do not match')
      return
    }
    
    try {
      setIsLoading(true)
      setErrorMsg(null)
      
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }

      // Redirect to login page on success
      router.push('/login?message=Your password has been reset successfully')
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
        <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
        <CardDescription className="text-center">
          Enter a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {errorMsg && (
          <Alert className="mb-6 bg-red-50 text-red-800 border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <Button 
                type="button" 
                variant="ghost" 
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="passwordConfirm" className="block text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="passwordConfirm"
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-10"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              <Button 
                type="button" 
                variant="ghost" 
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
                <span className="sr-only">{showConfirmPassword ? "Hide confirm password" : "Show confirm password"}</span>
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : null}
            Reset Password
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