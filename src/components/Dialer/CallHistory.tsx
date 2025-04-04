'use client';

import { useState, useEffect } from 'react';
import { 
  Paper, 
  ScrollArea, 
  Text, 
  Group, 
  Badge, 
  Stack, 
  Divider, 
  ActionIcon,
  Skeleton 
} from '@mantine/core';
import { IconPhoneOutgoing, IconPhoneIncoming, IconPhoneCall } from '@tabler/icons-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useSocket } from '@/hooks/useSocket';

interface CallRecord {
  id: string;
  direction: 'outbound' | 'inbound';
  to: string;
  from: string;
  status: 'completed' | 'failed' | 'missed' | 'in-progress';
  duration: number;
  startTime: string;
  endTime: string;
}

export function CallHistory() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const API_BASE_URL = 'http://localhost:8080/api'
  
  useEffect(() => {
    const fetchCallHistory = async () => {
      try {
        const { data } = await axios.get<CallRecord[]>(`${API_BASE_URL}/calls/history`);
        setCalls(data);
      } catch (error) {
        console.error('Failed to fetch call history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallHistory();

    if (socket) {
      socket.on('callUpdate', (newCall: CallRecord) => {
        setCalls(prev => [newCall, ...prev]);
      });
    }

    return () => {
      if (socket) socket.off('call-update');
    };
  }, [socket]);

  const getCallIcon = (direction: string) => {
    switch (direction) {
      case 'outbound':
        return <IconPhoneOutgoing size={18} />;
      case 'inbound':
        return <IconPhoneIncoming size={18} />;
      default:
        return <IconPhoneCall size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge color="green" variant="light">Completed</Badge>;
      case 'failed':
        return <Badge color="red" variant="light">Failed</Badge>;
      case 'missed':
        return <Badge color="orange" variant="light">Missed</Badge>;
      case 'in-progress':
        return <Badge color="blue" variant="light">In Progress</Badge>;
      default:
        return <Badge color="gray" variant="light">Unknown</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  return (
    <Paper withBorder p="md" radius="lg" shadow="sm">
      <Text size="lg" fw={500} mb="md">
        Recent Calls
      </Text>
      
      {loading ? (
        <Stack gap="xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={60} radius="sm" />
          ))}
        </Stack>
      ) : calls.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          No call history
        </Text>
      ) : (
        <ScrollArea h={400} scrollbarSize={6}>
          {calls.map((call) => (
            <div key={call.id}>
              <Group justify="space-between" p="sm">
                <Group gap="sm">
                  <ActionIcon variant="light" color="blue" size="lg">
                    {getCallIcon(call.direction)}
                  </ActionIcon>
                  <Stack gap={0}>
                    <Text fw={500}>
                      {call.direction === 'outbound' ? call.to : call.from}
                    </Text>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        {format(new Date(call.startTime), 'MMM d, h:mm a')}
                      </Text>
                      {call.duration > 0 && (
                        <>
                          <Text size="sm" c="dimmed">•</Text>
                          <Text size="sm" c="dimmed">
                            {formatDuration(call.duration)}
                          </Text>
                        </>
                      )}
                    </Group>
                  </Stack>
                </Group>
                {getStatusBadge(call.status)}
              </Group>
              <Divider />
            </div>
          ))}
        </ScrollArea>
      )}
    </Paper>
  );
}