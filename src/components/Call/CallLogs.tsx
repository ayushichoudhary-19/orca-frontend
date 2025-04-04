import { Stack, Text, Paper, ScrollArea } from '@mantine/core';

interface CallLog {
  id: string;
  to: string;
  from: string;
  status: string;
  startTime: Date;
  duration?: number;
}

interface CallLogsProps {
  logs: CallLog[];
}

export const CallLogs = ({ logs }: CallLogsProps) => {
  return (
    <Stack>
      <Text size="lg" fw={500}>Call History</Text>
      <ScrollArea h={400}>
        {logs.length === 0 ? (
          <Text c="dimmed" ta="center">No call history</Text>
        ) : (
          <Stack gap="xs">
            {logs.map((log) => (
              <Paper key={log.id} withBorder p="xs">
                <Text size="sm">To: {log.to}</Text>
                <Text size="sm">Status: {log.status}</Text>
                <Text size="xs" c="dimmed">
                  {new Date(log.startTime).toLocaleString()}
                </Text>
                {log.duration && (
                  <Text size="xs">Duration: {log.duration}s</Text>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Stack>
  );
};