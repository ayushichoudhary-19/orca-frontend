"use client";

import { useState } from "react";
import {
  TextInput,
  Button,
  Stack,
  Title,
  Container,
  Paper,
  Text,
  Group,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function CreateBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      businessName: "",
      adminEmail: "",
    },
    validate: {
      businessName: (value: string) =>
        value.trim().length === 0 ? "Business name is required" : null,
      adminEmail: (value: string) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const businessRes = await axiosClient.post("/api/business", {
        name: values.businessName,
      });

      const businessId = businessRes.data._id;

      await axiosClient.post("/api/invites", {
        email: values.adminEmail,
        role: "admin",
        type: "business",
        businessId,
      });

      toast.success("Business and admin invite created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create business or invite admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 via-violet-300 to-violet-500 p-6">
      <Container size="xs">
        <Center style={{ minHeight: "100vh" }}>
          <Paper shadow="xl" radius="lg" p="xl" withBorder className="w-full">
            <Stack>
              <Title order={2} ta="center">
                Let's get a new business onboard 🚀
              </Title>
              <Text c="dimmed" ta="center">
                Add a new company and invite the first admin to get started.
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md" mt="sm">
                  <TextInput
                    label="Business Name"
                    placeholder="e.g. Stark Industries"
                    {...form.getInputProps("businessName")}
                  />

                  <TextInput
                    label="Admin Email"
                    placeholder="admin@company.com"
                    {...form.getInputProps("adminEmail")}
                  />

                  <Group justify="center" mt="sm">
                    <Button type="submit" loading={loading} size="md" radius="md">
                      Create & Invite Admin
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Center>
      </Container>
    </div>
  );
}
