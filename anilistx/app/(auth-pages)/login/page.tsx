import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: "Login | AnilistX",
  description: "Sign in to your account to track your anime and discover new shows",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
        AnilistX
      </Link>

      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
} 