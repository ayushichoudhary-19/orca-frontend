"use client";

import { Button, Text, Stack, Group, Center, Paper } from "@mantine/core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleGetStarted = () => {
    router.push(isAuthenticated ? "/dashboard" : "/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eeff] via-[#f9f5ff] to-[#fefcff]">
      <Center h="100vh">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paper className="bg-transparent max-w-md mx-auto px-6 text-center">
            <Stack align="center" gap="md" w="100%">
              <h1 className="text-[3rem] mb-0">
                Welcome to <span className="text-primary">ORCA</span>
              </h1>

              <Text size="sm" c="dimmed" ta="center" className="text-wrap">
                ORCA is a modern cold-calling platform designed to help sales teams engage leads
                faster, streamline training, track performance, and drive conversions - all in one
                unified workspace.
              </Text>
              <Group grow mt="lg">
                <Button onClick={handleGetStarted} variant="filled" radius="md" size="md">
                  Get Started
                </Button>
              </Group>
            </Stack>
          </Paper>
        </motion.div>
      </Center>
    </div>
  );
}