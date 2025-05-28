"use client";

import { useState } from "react";
import { Paper, Button, Text, Stack, Group, Divider } from "@mantine/core";
import { motion } from "framer-motion";
import Link from "next/link";

interface StartCallingOverlayProps {
  onStart: () => void;
  onManualCallClick: () => void;
}

export function StartCallingOverlay({ onStart }: StartCallingOverlayProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        className="max-w-md w-full bg-white"
      >
        <Stack gap="md">
          <Text fw={800} className="text-2xl">
            Are you ready to start calling?
          </Text>
          <Divider className="mb-4" />
          <Group align="start">
            <Text className="text-dark text-sm">
              <span className="text-lg">🎓</span> <b>Get familiar with the calling environment</b>
              <br />Explore the environment made for engaging with leads and booking meetings. Take a moment to navigate the {" "}
              <Link href="#" className="text-primary underline">dialer walkthrough</Link>.
            </Text>
          </Group>

          <Group align="start">
          <Text className="text-dark text-sm">
              <span className="text-lg">⚙️</span> <b>Verify your audio settings</b>
              <br />Ensure the proper mic and speaker are selected and choose your autodial preference by clicking the gear icon below.
            </Text>
          </Group>

          <Group align="start">
          <Text className="text-dark text-sm">
              <span className="text-lg">📝</span> <b>Review your resources</b>
              <br />Prepare for your call by looking over scripts, objection handling, or personas provided in the resource tab on the right.
            </Text>
          </Group>

          <Button
            radius="md"
            size="md"
            fullWidth
            onClick={() => {
              setVisible(false);
              onStart();
            }}
          >
            Start Session
          </Button>

          {/* <Button
            variant="subtle"
            color="indigo"
            size="sm"
            onClick={() => {
              setVisible(false);
              onManualCallClick();
            }}
          >
            I want to call my own lead
          </Button> */}
        </Stack>
      </Paper>
    </motion.div>
  );
}
