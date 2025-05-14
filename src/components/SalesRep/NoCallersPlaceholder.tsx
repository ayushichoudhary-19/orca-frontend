"use client";

import { Button, Text } from "@mantine/core";

export default function NoCallersPlaceholder({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center my-16 bg-white p-20">
      <Text fw={600} size="lg" mb={8}>No Callers Yet</Text>
      <Text c="dimmed" mb={16}>
        You don’t have any approved callers yet. But that’s okay, our community is working hard on
        the qualification criteria and will submit auditions soon. See how the audition process works
      </Text>
      <Button variant="filled" 
      radius="md"
      size="md"
      className="font-normal text-[16px]"
      onClick={onClick}>
        See how the audition process works
      </Button>
    </div>
  );
}
