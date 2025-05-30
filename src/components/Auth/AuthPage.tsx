"use client";

import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuthErrorMessage, getErrorMessage, isFirebaseError } from "@/utils/errorUtils";
import { AuthForm } from "./AuthForm";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "@/lib/toast";

export const AuthPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchAndSetUser = async (uid: string) => {
    try {
      const res = await axiosClient.get("/api/user/me");
      const user = res.data;

      if (!user) {
        throw new Error("User not found");
      }

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

  const handleAuth = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await fetchAndSetUser(user.uid);
        router.push("/dashboard");
      } catch (fetchErr) {
        const inviteCheck = await axiosClient.get(`/api/invites/check?email=${email}`);
        if (!inviteCheck.data.exists) {
          toast.error("You're not invited to ORCA.");
          return;
        }

        await axiosClient.post(`/api/user`, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
        });

        await fetchAndSetUser(user.uid);
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (isFirebaseError(error) && error.code === "auth/user-not-found") {
        try {
          const inviteCheck = await axiosClient.get(`/api/invites/check?email=${email}`);
          if (!inviteCheck.data.exists) {
            toast.error("You're not invited to ORCA.");
            return;
          }
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          await axiosClient.post(`/api/user`, {
            uid: newUser.user.uid,
            email: newUser.user.email,
            name: newUser.user.displayName || "",
          });

          await fetchAndSetUser(newUser.user.uid);
          router.push("/dashboard");
        } catch (inviteErr: unknown) {
          const message = isFirebaseError(inviteErr)
            ? getFirebaseAuthErrorMessage(inviteErr.code)
            : getErrorMessage(inviteErr);
          toast.error(message);
        }
      } else {
        const message = isFirebaseError(error)
          ? getFirebaseAuthErrorMessage(error.code)
          : getErrorMessage(error);
        toast.error(message);
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const tempResult = await signInWithPopup(auth, provider);
      const email = tempResult.user.email;

      await auth.signOut();

      const res = await axiosClient.get(`/api/invites/check?email=${email}`);
      if (!res.data.exists) {
        toast.error("You're not invited. Access denied.");
        return;
      }

      const finalResult = await signInWithPopup(auth, provider);
      const finalUser = finalResult.user;

      await axiosClient.post(`/api/user`, {
        uid: finalUser.uid,
        email: finalUser.email,
        name: finalUser.displayName || "",
      });

      await fetchAndSetUser(finalUser.uid);
      router.push("/dashboard");
    } catch (error) {
      const message = isFirebaseError(error)
        ? getFirebaseAuthErrorMessage(error.code)
        : getErrorMessage(error);
      toast.error(message);
    }
  };

  return <AuthForm onSubmit={handleAuth} onGoogleAuth={handleGoogleAuth} />;
};
