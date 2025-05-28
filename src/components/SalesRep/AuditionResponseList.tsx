"use client";
import { Text, Paper, Stack } from "@mantine/core";

interface Response {
  questionId: string;
  questionText: string;
  audioUrl: string;
}

interface AuditionResponseListProps {
  responses: Response[];
}

export default function AuditionResponseList({ responses }: AuditionResponseListProps) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (!responses || responses.length === 0) {
    return <Text>No audio responses available for this audition.</Text>;
  }

  return (
    <Stack gap="lg">
      {responses.map((res, idx) => (
        <Paper key={res.questionId.toString()} p="md" radius="md" shadow="xs" withBorder>
          <Text fw={600} mb="sm">{`Q${idx + 1}: ${res.questionText}`}</Text>
          {res.audioUrl ? (
            <audio
              controls
              src={`${apiBaseUrl}/api/uploads/stream/${res.audioUrl}`}
              className="w-full rounded-md"
              preload="metadata"
            >
              Your browser does not support the audio element.
            </audio>
          ) : (
            <Text size="sm" c="dimmed">
              No audio submitted for this question.
            </Text>
          )}
        </Paper>
      ))}
    </Stack>
  );
}
