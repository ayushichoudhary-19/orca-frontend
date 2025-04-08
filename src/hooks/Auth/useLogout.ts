import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/authSlice";
import { auth } from "@/lib/firebase-config";
import { useRouter } from "next/navigation";
import { persistor } from "@/store/store";

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(clearAuth());
      await persistor.purge();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return logout;
};
