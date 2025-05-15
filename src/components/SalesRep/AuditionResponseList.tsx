"use client";
import { Text, Paper, Stack } from "@mantine/core";

interface Response {
  questionId: string;
  questionText: string;
  audioUrl: string;
}

export default function AuditionResponseList({ responses }: { responses: Response[] }) {
  return (
    <Stack gap="lg">
      {responses.map((res, idx) => (
        <Paper key={res.questionId} p="md" radius="md">
          <Text fw={600} mb="sm">{`Q${idx + 1}: ${res.questionText}`}</Text>
          <audio controls src={res.audioUrl} className="w-full rounded-md" />
        </Paper>
      ))}
    </Stack>
  );
}
