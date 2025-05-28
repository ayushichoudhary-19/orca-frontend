"use client";

import { Group, Text, Paper } from "@mantine/core";

export default function CustomBadge({
  label,
  icon,
  value,
}: {
  label?: string;
  icon?: React.ReactNode;
  value: string;
}) {
  return (
    <Paper
      px="xs"
      py={4}
      radius="md"
      className="bg-lighter"
      style={{
        border: "1px solid #B0A4FD",
      }}
    >
      <Group gap="xs" align="center" wrap="nowrap">
        {icon}
        {label ? (
          <>
            <Text size="xs" fw={600}>
              {label}
            </Text>
            <Text size="xs" fw={500}>
              {value}
            </Text>
          </>
        ) : (
          <Text size="xs" fw={500}>
            {value}
          </Text>
        )}
      </Group>
    </Paper>
  );
}
