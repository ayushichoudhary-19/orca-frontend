"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useFetchPermissions } from "uptut-rbac";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const roleId = useAppSelector((state) => state.auth.roleId);
  useFetchPermissions(isAuthenticated && roleId ? roleId : "");
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
