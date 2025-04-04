import { Text, Stack, Badge } from '@mantine/core';

interface CallStatsProps {
  call: {
    id: string;
    to: string;
    from: string;
    status: string;
    startTime: Date;
  } | null;
}

export const CallStats = ({ call }: CallStatsProps) => {
  if (!call) {
    return (
      <Text c="dimmed" ta="center">No active call</Text>
    );
  }

  const duration = Math.floor((Date.now() - new Date(call.startTime).getTime()) / 1000);

  return (
    <Stack>
      <Text size="lg" fw={500}>Call Statistics</Text>
      <div className="grid grid-cols-2 gap-4">
        <Text>Call ID:</Text>
        <Text>{call.id}</Text>
        <Text>From:</Text>
        <Text>{call.from}</Text>
        <Text>To:</Text>
        <Text>{call.to}</Text>
        <Text>Status:</Text>
        <Badge color={call.status === 'initiated' ? 'blue' : 'green'}>
          {call.status}
        </Badge>
        <Text>Duration:</Text>
        <Text>{duration}s</Text>
      </div>
    </Stack>
  );
};