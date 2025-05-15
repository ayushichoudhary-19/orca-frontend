"use client"

import { useState, useEffect } from "react"
import { Card, Text, SimpleGrid, Grid, Button } from "@mantine/core"
import { motion } from "framer-motion"
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconPhoneCall,
  IconClock,
  IconChartBar,
  IconMapPin,
  IconDeviceAnalytics,
} from "@tabler/icons-react"

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const frameRate = 30 // updates per second
    const totalFrames = Math.min(60, Math.ceil(duration / (1000 / frameRate))) // cap to 60 frames
    const increment = end / totalFrames

    const interval = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(interval)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / frameRate)

    return () => clearInterval(interval)
  }, [value, duration])

  return <>{count.toLocaleString()}</>
}


export default function DashboardPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Text size="xl" fw={700} mb="xl" className="text-2xl">
        Dashboard Overview
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            withBorder
            p="lg"
            radius="md"
            className="border border-gray-200 hover:border-[#E8E4FF] transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="bg-[#F0EDFF] p-2 rounded-md">
                <IconUsers size={24} className="text-[#6D57FC]" stroke={1.5} />
              </div>
              <div className="bg-green-50 p-1 rounded-full">
                <IconArrowUpRight size={16} className="text-green-500" />
              </div>
            </div>
            <Text size="sm" c="dimmed" mt="md">
              Total Users
            </Text>
            <div className="flex items-end gap-2 mt-1">
              <Text size="xl" fw={700} className="text-2xl">
                <AnimatedCounter value={1234} />
              </Text>
              <Text c="teal" size="sm" fw={500} pb={1}>
                +12.4%
              </Text>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card
            withBorder
            p="lg"
            radius="md"
            className="border border-gray-200 hover:border-[#E8E4FF] transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="bg-[#F0EDFF] p-2 rounded-md">
                <IconPhoneCall size={24} className="text-[#6D57FC]" stroke={1.5} />
              </div>
              <div className="bg-red-50 p-1 rounded-full">
                <IconArrowDownRight size={16} className="text-red-500" />
              </div>
            </div>
            <Text size="sm" c="dimmed" mt="md">
              Active Calls
            </Text>
            <div className="flex items-end gap-2 mt-1">
              <Text size="xl" fw={700} className="text-2xl">
                <AnimatedCounter value={145} />
              </Text>
              <Text c="red" size="sm" fw={500} pb={1}>
                -4.3%
              </Text>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card
            withBorder
            p="lg"
            radius="md"
            className="border border-gray-200 hover:border-[#E8E4FF] transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="bg-[#F0EDFF] p-2 rounded-md">
                <IconClock size={24} className="text-[#6D57FC]" stroke={1.5} />
              </div>
              <div className="bg-green-50 p-1 rounded-full">
                <IconArrowUpRight size={16} className="text-green-500" />
              </div>
            </div>
            <Text size="sm" c="dimmed" mt="md">
              Total Minutes
            </Text>
            <div className="flex items-end gap-2 mt-1">
              <Text size="xl" fw={700} className="text-2xl">
                <AnimatedCounter value={23456} />
              </Text>
              <Text c="teal" size="sm" fw={500} pb={1}>
                +8.2%
              </Text>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card
            withBorder
            p="lg"
            radius="md"
            className="border border-gray-200 hover:border-[#E8E4FF] transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="bg-[#F0EDFF] p-2 rounded-md">
                <IconChartBar size={24} className="text-[#6D57FC]" stroke={1.5} />
              </div>
            </div>
            <Text size="sm" c="dimmed" mt="md">
              Success Rate
            </Text>
            <div className="flex justify-start mt-2">
             
                  <div>
                    <Text size="lg" fw={700} className="text-[#6D57FC]">
                      98%
                    </Text>
                  </div>
             
              
            </div>
          </Card>
        </motion.div>
      </SimpleGrid>

      <Grid mt="xl" gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card
              withBorder
              p="lg"
              radius="md"
              className="border border-gray-200 hover:border-[#E8E4FF] transition-all duration-200 h-full"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#F0EDFF] p-2 rounded-md">
                  <IconDeviceAnalytics size={20} className="text-[#6D57FC]" stroke={1.5} />
                </div>
                <Text size="lg" fw={600}>
                  Recent Activity
                </Text>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center p-3 hover:bg-[#F8F6FF] rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#E8E4FF]">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F0EDFF] h-10 w-10 rounded-full flex items-center justify-center">
                          <IconPhoneCall size={18} className="text-[#6D57FC]" stroke={1.5} />
                        </div>
                        <div>
                          <Text size="sm" fw={500}>
                            Call #{item}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Duration: 5:23 mins
                          </Text>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text size="xs" c="dimmed">
                          2 hours ago
                        </Text>
                        <div className="text-xs mt-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full inline-block">
                          Completed
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button className="text-sm font-normal">View all activity</Button>
              </div>
            </Card>
          </motion.div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card
              withBorder
              p="lg"
              radius="md"
              className="border border-gray-200 hover:border-[#E8E4FF] transition-all duration-200 h-full"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#F0EDFF] p-2 rounded-md">
                  <IconChartBar size={20} className="text-[#6D57FC]" stroke={1.5} />
                </div>
                <Text size="lg" fw={600}>
                  Quick Stats
                </Text>
              </div>
              <div className="space-y-6">
                <div className="p-3 rounded-md hover:bg-[#F8F6FF] transition-colors">
                  <Text size="sm" c="dimmed">
                    Average Call Duration
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <IconClock size={18} className="text-[#6D57FC]" stroke={1.5} />
                    <Text size="lg" fw={700}>
                      4.5 minutes
                    </Text>
                  </div>
                </div>
                <div className="p-3 rounded-md hover:bg-[#F8F6FF] transition-colors">
                  <Text size="sm" c="dimmed">
                    Peak Hours
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <IconClock size={18} className="text-[#6D57FC]" stroke={1.5} />
                    <Text size="lg" fw={700}>
                      2 PM - 4 PM
                    </Text>
                  </div>
                </div>
                <div className="p-3 rounded-md hover:bg-[#F8F6FF] transition-colors">
                  <Text size="sm" c="dimmed">
                    Most Active Region
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <IconMapPin size={18} className="text-[#6D57FC]" stroke={1.5} />
                    <Text size="lg" fw={700}>
                      North America
                    </Text>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button className=" text-sm font-normal">View detailed analytics</Button>
              </div>
            </Card>
          </motion.div>
        </Grid.Col>
      </Grid>
    </div>
  )
}
