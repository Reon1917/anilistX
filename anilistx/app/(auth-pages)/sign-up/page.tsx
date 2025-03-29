import { SignUpForm } from "@/components/auth/signup-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | AnilistX",
  description: "Create a new account to track your anime and discover new shows",
}

export default function SignUpPage() {
  return <SignUpForm />
}
