import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import notesReducer from './notesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['notes']
};

const persistedReducer = persistReducer(persistConfig, notesReducer);

export const store = configureStore({
  reducer: {
    notes: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;