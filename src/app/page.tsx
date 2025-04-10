"use client";

import { Button, Title, Text, Stack, Group, Container, Center } from "@mantine/core";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container h="100vh" size="xs">
      <Center h="100%">
        <Stack align="center" gap="md" w="100%">
          <Title order={1}>Welcome to ORCA</Title>
          <Text size="sm" c="dimmed" ta="center">
            Your secure portal to get started with our platform.
          </Text>

          <Group grow mt="md">
            <Button component={Link} href="/signin" variant="outline" radius="md">
              Sign In
            </Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  );
}
