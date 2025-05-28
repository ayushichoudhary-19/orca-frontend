"use client";

import { useState } from "react";
import { AuthForm } from "@/components/Auth/AuthForm";
import { SDRRegistrationForm } from "./SDRRegistrationForm";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { isFirebaseError, getFirebaseAuthErrorMessage, getErrorMessage } from "@/utils/errorUtils";
import { axiosClient } from "@/lib/axiosClient";

export default function SalesRepAuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async ({
    fullName,
    email,
    password,
    phoneNumber,
    languages,
  }: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    languages: { language: string; proficiency: string }[];
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const formData = new FormData();
      formData.append("uid", user.uid);
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("languages", JSON.stringify(languages));

      await axiosClient.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/register-sales-rep`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(setAuth({ email, uid: user.uid, name: fullName }));

      router.push("/dashboard");
    } catch (error: unknown) {
      const message = isFirebaseError(error)
        ? getFirebaseAuthErrorMessage(error.code)
        : getErrorMessage(error);
      throw new Error(message);
    }
  };

  const handleSignin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await axiosClient.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/`, {
        uid: user.uid,
        email: user.email,
        name: user.displayName ?? "",
      });

      dispatch(setAuth({ email: user.email || "", uid: user.uid, name: user.displayName || "" }));
      router.push("/dashboard");
    } catch (error: unknown) {
      const message = isFirebaseError(error)
        ? getFirebaseAuthErrorMessage(error.code)
        : getErrorMessage(error);
      throw new Error(message);
    }
  };

  return mode === "signup" ? (
    <SDRRegistrationForm onSubmit={handleSignup} onBack={() => setMode("signin")} />
  ) : (
    <AuthForm onSubmit={handleSignin} onGoogleAuth={undefined} />
  );
}
