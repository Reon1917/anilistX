'use client'

import { useState, FormEvent } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { FaGoogle } from 'react-icons/fa'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageDisplay } from '@/components/auth/message-display'
import { signInAction, signInWithGoogleAction } from '@/app/actions'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    // Basic validation
    if (!email) {
      setErrorMsg('Email is required')
      return
    }
    if (!password) {
      setErrorMsg('Password is required')
      return
    }
    
    setIsLoading(true)
    setErrorMsg(null)
      
    // Use the form action for server-side authentication
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    await signInAction(formData)
    
    setIsLoading(false)
  }
  
  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true)
      setErrorMsg(null)
      
      await signInWithGoogleAction()
    } catch (error) {
      setErrorMsg('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg dark:border-gray-800">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <MessageDisplay />
        
        {errorMsg && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full relative h-11"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : (
              <FaGoogle className="mr-2 h-5 w-5 text-[#4285F4]" />
            )}
            <span>Continue with Google</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or with email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
              ) : null}
              Sign In
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-primary font-medium hover:underline">
            Create account
          </a>
        </p>
      </CardFooter>
    </Card>
  )
} 