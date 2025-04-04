import { AppShell } from '@mantine/core';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <AppShell>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};