"use client";

import { auth } from "@/lib/firebase-config";
import {
  createUserWithEmailAndPassword,
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

type Props = {
  type: "signin" | "signup";
};

export const AuthPage = ({ type }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAuth = async (email: string, password: string) => {
    try {
      const userCredential =
        type === "signin"
          ? await signInWithEmailAndPassword(auth, email, password)
          : await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      dispatch(setAuth({ email: user.email || "", uid: user.uid }));
      router.push("/call");
    } catch (error: unknown) {
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
      type={type}
      onGoogleAuth={handleGoogleAuth}
    />
  );
};
