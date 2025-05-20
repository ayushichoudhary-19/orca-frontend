"use client";

import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "@/store/store";
import { RBACProvider, RBACConfig } from "uptut-rbac";
import { MembershipProvider } from "./MembershipProvider";

function RBACWrapper({ children }: { children: React.ReactNode }) {
  const businessId = useSelector((state: RootState) => state.membership.businessId);

  const rbacConfig: RBACConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    endpoints: {
      getRoles: () => `${process.env.NEXT_PUBLIC_BASE_URL}/api/roles/business/${businessId}`,
      createRole: `${process.env.NEXT_PUBLIC_BASE_URL}/api/roles/business/${businessId}`,
    },
    requestHeaders: () => ({
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    }),
  };

  return <RBACProvider config={rbacConfig}>{children}</RBACProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MembershipProvider />
        <RBACWrapper>{children}</RBACWrapper>
      </PersistGate>
    </Provider>
  );
}
