import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { axiosClient } from "@/lib/axiosClient";
import { Membership } from "@/types/membership";
import { useDispatch } from "react-redux";
import { setMembership, clearMembership } from "@/store/membershipSlice";

export const useFetchMembership = () => {
  const [localMembership, setLocalMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLocalMembership(null);
        dispatch(clearMembership());
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get(`/api/memberships/by-user/${user.uid}`);
        const memberships: Membership[] = res.data;
        console.log("Memberships:", memberships);

        if (memberships.length > 0) {
          const m = memberships[0];
          setLocalMembership(m);
          dispatch(setMembership(m));
        } else {
          setLocalMembership(null);
          dispatch(clearMembership());
        }
      } catch (err) {
        console.error("Error fetching membership:", err);
        setLocalMembership(null);
        dispatch(clearMembership());
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { membership: localMembership, loading };
};
