"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { RBACProvider } from 'uptut-rbac';
import { useAppSelector } from '@/store/hooks';

function RBACWrapper({ children }: { children: React.ReactNode }) {
  const roleId = useAppSelector((state) => state.auth.roleId ?? "");

  return (
    <RBACProvider getFeatureUrl={() => `/api/features?role=${roleId}`}>
      {children}
    </RBACProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RBACWrapper>{children}</RBACWrapper>
      </PersistGate>
    </Provider>
  );
}
