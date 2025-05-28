import { useDispatch } from "react-redux";
import { addNotification } from "@/store/notificationSlice";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import { messaging } from "@/lib/messaging";

export function useFcmNotifications() {
  const dispatch = useDispatch();


  useEffect(() => {
    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      const { campaignId, postId, type } = payload.data || {}; // type: 'post' | 'message'

      dispatch(addNotification({ type: type as "post" | "message", read: false }));

      toast((t) => (
        <div onClick={() => {
          window.location.href =
            type === "post"
              ? `/campaigns/${campaignId}/posts/${postId}`
              : `/messages`;
          toast.dismiss(t.id);
        }}>
          <strong>{title}</strong>
          <div>{body}</div>
        </div>
      ));
    });

    return () => unsubscribe();
  }, []);
}
