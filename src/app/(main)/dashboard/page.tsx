"use client";

import { Card, Grid, Group, Text, RingProgress, SimpleGrid } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <Text size="xl" fw={700} mb="md">Dashboard Overview</Text>

      <SimpleGrid cols={4}>
        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Total Users</Text>
            <IconArrowUpRight size={20} className="text-green-500" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text size="xl" fw={700}>1,234</Text>
            <Text c="teal" size="sm" fw={500}>+12.4%</Text>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Active Calls</Text>
            <IconArrowDownRight size={20} className="text-red-500" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text size="xl" fw={700}>145</Text>
            <Text c="red" size="sm" fw={500}>-4.3%</Text>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Total Minutes</Text>
            <IconArrowUpRight size={20} className="text-green-500" />
          </Group>
          <Group align="flex-end" gap="xs" mt={25}>
            <Text size="xl" fw={700}>23,456</Text>
            <Text c="teal" size="sm" fw={500}>+8.2%</Text>
          </Group>
        </Card>

        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">Success Rate</Text>
          </Group>
          <Group justify="center" mt="xs">
            <RingProgress
              size={80}
              roundCaps
              thickness={8}
              sections={[{ value: 98, color: 'teal' }]}
              label={
                <Text ta="center" size="xs" fw={700}>98%</Text>
              }
            />
          </Group>
        </Card>
      </SimpleGrid>

      <Grid mt="xl">
        <Grid.Col span={8}>
          <Card withBorder p="md" radius="md">
            <Text size="lg" fw={500} mb="md">Recent Activity</Text>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div>
                    <Text size="sm" fw={500}>Call #{item}</Text>
                    <Text size="xs" c="dimmed">Duration: 5:23 mins</Text>
                  </div>
                  <Text size="xs" c="dimmed">2 hours ago</Text>
                </div>
              ))}
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder p="md" radius="md">
            <Text size="lg" fw={500} mb="md">Quick Stats</Text>
            <div className="space-y-3">
              <div>
                <Text size="sm">Average Call Duration</Text>
                <Text size="lg" fw={700}>4.5 minutes</Text>
              </div>
              <div>
                <Text size="sm">Peak Hours</Text>
                <Text size="lg" fw={700}>2 PM - 4 PM</Text>
              </div>
              <div>
                <Text size="sm">Most Active Region</Text>
                <Text size="lg" fw={700}>North America</Text>
              </div>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}