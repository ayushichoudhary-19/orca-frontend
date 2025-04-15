import { auth } from "@/lib/firebase-config";
import { persistor } from "@/store/store";
import { clearAuth } from "@/store/authSlice";
import { Dispatch } from "@reduxjs/toolkit";

export const executeLogout = async (dispatch: Dispatch) => {
  try {
    await auth.signOut();
    dispatch(clearAuth());
    await persistor.purge();
    window.location.href = "/signin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
