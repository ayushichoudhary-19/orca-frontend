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
import { toast } from "@/lib/toast";

export default function SalesRepAuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchAndSetUser = async (uid: string) => {
    try {
      const res = await axiosClient.get("/api/user/me");
      const user = res.data;

      if (!user) throw new Error("User not found");

      dispatch(
        setAuth({
          email: user.email,
          uid: user._id,
          name: user.name,
          role: user.role,
          businessId: user.businessId,
        })
      );
    } catch (err) {
      throw err;
    }
  };

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
      const freshToken = await user.getIdToken(true);
      console.log("user.uid:", user.uid);
      console.log("Decoded token UID:", JSON.parse(atob(freshToken.split(".")[1])).user_id);
      localStorage.setItem("authToken", freshToken); 
      const formData = new FormData();
      formData.append("uid", user.uid);
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("languages", JSON.stringify(languages));

      await axiosClient.post(`/api/user/register-sales-rep`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchAndSetUser(user.uid);
      router.push("/campaigns");
    } catch (error: unknown) {
      const message = isFirebaseError(error)
        ? getFirebaseAuthErrorMessage(error.code)
        : getErrorMessage(error);
      toast.error(message);
    }
  };

  const handleSignin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await axiosClient.post(`/api/user`, {
        uid: user.uid,
        email: user.email,
        name: user.displayName ?? "",
      });

      await fetchAndSetUser(user.uid);
      router.push("/dashboard");
    } catch (error: unknown) {
      const message = isFirebaseError(error)
        ? getFirebaseAuthErrorMessage(error.code)
        : getErrorMessage(error);
      toast.error(message);
    }
  };

  return mode === "signup" ? (
    <SDRRegistrationForm onSubmit={handleSignup} onBack={() => setMode("signin")} />
  ) : (
    <AuthForm onSubmit={handleSignin} onGoogleAuth={undefined} />
  );
}
