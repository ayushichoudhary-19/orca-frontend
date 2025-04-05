'use client';

import {
  IconPhoneCall,
  IconUsers,
  IconChartBar,
  IconLogout,
  IconSettings,
  IconMessageCircle,
  IconAlertCircle
} from '@tabler/icons-react';
import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dialer', icon: IconPhoneCall, path: '/dialer' },
  { label: 'Analytics', icon: IconChartBar, path: '/analytics' },
  { label: 'Contacts', icon: IconUsers, path: '/contacts' },
  { label: 'Messages', icon: IconMessageCircle, path: '/messages' },
  { label: 'Settings', icon: IconSettings, path: '/settings' },
  { label: 'Alerts', icon: IconAlertCircle, path: '/alerts' },
];

export default function Sidebar() {
  const [active, setActive] = useState('Dialer');
  const router = useRouter();

  const handleNavigate = (item: typeof navItems[number]) => {
    setActive(item.label);
    router.push(item.path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[72px] bg-gradient-to-b from-[#7192E9] to-[#4469CA] flex flex-col items-center py-6 overflow-hidden">
         {/* Logo */}
      <div className="flex flex-col items-center pt-2">
        <div className="w-10 h-10 rounded-full bg-[#8cd2ff] border-2 border-white flex items-center justify-center mb-2">
          <div className="w-3 h-3 rounded-full bg-white" />
        </div>
      </div>

      {/* Nav Items */}
      <Stack justify="center" gap={32} className="flex-1 mt-4">
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <Tooltip key={item.label} label={item.label} position="right" withArrow>
              <UnstyledButton
                onClick={() => handleNavigate(item)}
                className="w-full flex flex-col items-center justify-center transition-all"
              >
                <item.icon 
                  size={22} 
                  stroke={1.5} 
                  color={isActive ? 'white' : '#bfd7ff'} 
                />
                {isActive && (
                  <div className="w-1 h-1 bg-white rounded-full mt-1" />
                )}
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>

      {/* Logout */}
      <div className="pb-4">
        <Tooltip label="Logout" position="right" withArrow>
          <UnstyledButton
            onClick={() => console.log('logout')}
            className="w-full flex items-center justify-center transition-all"
          >
            <IconLogout size={22} stroke={1.5} color="#bfd7ff" />
          </UnstyledButton>
        </Tooltip>
      </div>
    </div>
  );
}
