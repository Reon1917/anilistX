import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: "Reset Password | AnilistX",
  description: "Reset your password to access your account",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
