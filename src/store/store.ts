import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import notesReducer from "./notesSlice";
import authReducer from "./authSlice";
import campaignReducer from "./campaignSlice";
import notificationReducer from "./notificationSlice";
import businessReducer from "./businessSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["notes", "auth", "features", "campaign", "notification", "business"],
};

const rootReducer = combineReducers({
  notes: notesReducer,
  auth: authReducer,
  campaign: campaignReducer,
  notification: notificationReducer,
  business: businessReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;