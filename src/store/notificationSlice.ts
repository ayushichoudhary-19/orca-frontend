import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Notification = {
  type: "post" | "message";
  read: boolean;
};

interface NotificationState {
  list: Notification[];
}

const initialState: NotificationState = {
  list: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      const exists = state.list.some(
        (n) => n.type === action.payload.type && !n.read
      );
      if (!exists) {
        state.list.push(action.payload);
      }
    },
    markAsRead(state, action: PayloadAction<"post" | "message">) {
      state.list = state.list.map((n) =>
        n.type === action.payload ? { ...n, read: true } : n
      );
    },
    clearNotifications(state) {
      state.list = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
