"use client";

import { auth } from "@/lib/firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  getFirebaseAuthErrorMessage,
  getErrorMessage,
  isFirebaseError,
} from "@/utils/errorUtils";
import { AuthForm } from "./AuthForm";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import axios from "axios";

export const AuthPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAuth = async (email: string, password: string) => {
    try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/`, {
      uid: user.uid,
      email: user.email,
    });
  
    dispatch(setAuth({ email: user.email || "", uid: user.uid }));
    router.push("/call");
  }
   catch (error: unknown) {
        const message = isFirebaseError(error)
          ? getFirebaseAuthErrorMessage(error.code)
          : getErrorMessage(error);
      
        throw new Error(message);
      }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(setAuth({ email: user.email || "", uid: user.uid }));
      router.push("/call");
    } catch (error: unknown) {
        const message = isFirebaseError(error)
          ? getFirebaseAuthErrorMessage(error.code)
          : getErrorMessage(error);
      
        throw new Error(message);
      }
  };

  return (
    <AuthForm
      onSubmit={handleAuth}
      onGoogleAuth={handleGoogleAuth}
    />
  );
};
