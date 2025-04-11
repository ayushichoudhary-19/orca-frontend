"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { RBACProvider, RBACConfig } from "uptut-rbac";

function RBACWrapper({ children }: { children: React.ReactNode }) {
const rbacConfig: RBACConfig = {
  endpoints: {
    getFeatures: (r) => `/api/features?role=${r}`,
    getRoles: () => "/api/roles",
    createRole: "/api/roles",
    createFeature: "/api/features/create",
    uploadFeatureJson: "/api/features/bulk",
    addFeaturesToRole: "/api/features/bulk-add",
    removeFeaturesFromRole: "/api/features/bulk-remove",
    removeRole: "/api/roles",
    getFeaturesByCategory: (category) => `/api/features/category?name=${category}`,
    getAllCategories: () => "/api/categories",
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
        <RBACWrapper>{children}</RBACWrapper>
      </PersistGate>
    </Provider>
  );
}
