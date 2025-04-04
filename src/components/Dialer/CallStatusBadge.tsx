'use client';

import { Badge } from '@mantine/core';
import { motion } from 'framer-motion';

interface CallStatusBadgeProps {
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
}

export function CallStatusBadge({ status }: CallStatusBadgeProps) {
  const statusMap = {
    idle: { label: 'Ready', color: 'gray'},
    calling: { label: 'Calling...', color: 'blue'},
    ringing: { label: 'Ringing', color: 'yellow' },
    connected: { label: 'Connected', color: 'green'},
    ended: { label: 'Ended', color: 'red'}
  };

  const pulseAnimation = status === 'calling' || status === 'ringing';

  return (
    <motion.div
      animate={pulseAnimation ? { scale: [1, 1.05, 1] } : {}}
      transition={pulseAnimation ? { repeat: Infinity, duration: 1.5 } : {}}
    >
      <Badge 
        color={statusMap[status].color} 
        variant="light" 
        size="lg" 
      >
        {statusMap[status].label}
      </Badge>
    </motion.div>
  );
}
