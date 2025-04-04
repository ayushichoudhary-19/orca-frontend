// components/Dialer/CallStatusBadge.tsx
'use client';

import { Badge } from '@mantine/core';

interface CallStatusBadgeProps {
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
}

export function CallStatusBadge({ status }: CallStatusBadgeProps) {
  const statusMap = {
    idle: { label: 'Ready', color: 'gray' },
    calling: { label: 'Calling...', color: 'blue' },
    ringing: { label: 'Ringing', color: 'yellow' },
    connected: { label: 'Connected', color: 'green' },
    ended: { label: 'Ended', color: 'red' }
  };

  return (
    <Badge color={statusMap[status].color} variant="light" size="lg" mt="xs">
      {statusMap[status].label}
    </Badge>
  );
}