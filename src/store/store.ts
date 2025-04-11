import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import notesReducer from "./notesSlice";
import authReducer from "./authSlice";
import { featureReducer } from "uptut-rbac";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["notes", "auth", "features"],
};

const rootReducer = combineReducers({
  notes: notesReducer,
  auth: authReducer,
  features: featureReducer,  // Add the featureReducer from uptut-rbac
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
