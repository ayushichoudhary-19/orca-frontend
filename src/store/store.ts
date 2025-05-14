import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import notesReducer from "./notesSlice";
import authReducer from "./authSlice";
import { featureReducer } from "uptut-rbac";
import membershipReducer from "./membershipSlice";
import campaignReducer from "./campaignSlice";
import notificationReducer from "./notificationSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["notes", "auth", "features", "membership", "campaign", "notification"],
  blacklist: ['membership.loading'],
};

const rootReducer = combineReducers({
  notes: notesReducer,
  auth: authReducer,
  features: featureReducer,
  membership: membershipReducer,
  campaign: campaignReducer,
  notification: notificationReducer,
});

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;