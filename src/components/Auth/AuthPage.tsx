"use client"

import { auth } from "@/lib/firebase-config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { useRouter } from "next/navigation"
import { getFirebaseAuthErrorMessage } from "@/utils/errorUtils"
import { AuthForm } from "./AuthForm"

type Props = {
  type: "signin" | "signup"
}

export const AuthPage = ({ type }: Props) => {
  const router = useRouter()

  const handleAuth = async (email: string, password: string) => {
    try {
      if (type === "signin") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push("/call")
    } catch (error: any) {
      throw new Error(getFirebaseAuthErrorMessage(error.code))
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/call")
    } catch (error: any) {
      throw new Error(getFirebaseAuthErrorMessage(error.code))
    }
  }

  return <AuthForm onSubmit={handleAuth} type={type} onGoogleAuth={handleGoogleAuth} />
}
