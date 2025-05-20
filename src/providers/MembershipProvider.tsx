"use client";

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { axiosClient } from "@/lib/axiosClient";
import {
  clearMembership,
  setMembership,
  setMembershipLoading,
} from "@/store/membershipSlice";
import { Membership } from "@/types/membership";

export const MembershipProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    dispatch(setMembershipLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(clearMembership());
        dispatch(setMembershipLoading(false));
        return;
      }

      try {
        const res = await axiosClient.get(`/api/memberships/by-user/${user.uid}`);
        const memberships: Membership[] = res.data;

        if (memberships.length > 0) {
          dispatch(setMembership(memberships[0]));
        } else {
          dispatch(clearMembership());
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          dispatch(clearMembership());
        } else {
          console.error("Membership fetch failed", err);
          dispatch(clearMembership());
        }
      } finally {
        dispatch(setMembershipLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};