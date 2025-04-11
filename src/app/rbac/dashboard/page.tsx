"use client";

import { RBACRoleFeatureManager } from "uptut-rbac";

export default function RBACManagerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">RBAC Role-Feature Manager</h1>
      <RBACRoleFeatureManager />
    </div>
  );
}
