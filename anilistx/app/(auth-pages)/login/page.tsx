import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | AnilistX",
  description: "Sign in to your account to track your anime and discover new shows",
}

export default function LoginPage() {
  return <LoginForm />
} 