"use client"

import { useState } from "react"
import { Paper, Text, Group, Stack, Button, FileButton } from "@mantine/core"
import { IconCircleCheckFilled, IconCircleDashedCheck, IconInfoCircle } from "@tabler/icons-react"
import Image from "next/image"

interface LeadUploadOptionsProps {
  onNext: (file: File, parsed: any[]) => void
}

export default function LeadUploadOptions({ onNext }: LeadUploadOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<"csv" | "crm">("csv")
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return
    setFile(selectedFile)

    import("papaparse").then(({ default: Papa }) => {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onNext(selectedFile, results.data)
        },
      })
    })
  }

  return (
    <Stack gap="xl" maw={1000} mx="auto" py="xl" px="md">
      <div>
        <Text fw={700} mb="xs" className="text-[32px]">
          How would you like to add your leads?
        </Text>
        <Text size="md" className="text-tinteddark7 font-normal">
          Let us know how you would like to set up your lead list so we can set up your campaign accordingly
        </Text>
      </div>

      <Group grow align="stretch" gap="xl">
        <Paper
          withBorder
          p="lg"
          radius="md"
          className={`cursor-pointer`}
          onClick={() => setSelectedOption("csv")}
        >
          <Group mb="4px" gap={5}>  
            <IconCircleCheckFilled size={28} color="#6D57FC" stroke={1.5} />
            
            <Group className="gap-2">
              <Text fw={500} className="text-darker">Upload CSV</Text>
              <Text size="xs" c="dimmed">
                Recommended
              </Text>
            </Group>
          </Group>
          <Text size="12px" ml={30}>Quickly upload a static CSV file</Text>
        </Paper>

        <Paper withBorder p="lg" radius="md" className="opacity-70 cursor-not-allowed">
          <Group mb="4px" gap={5}> 
            <IconCircleDashedCheck size={28} color="gray" stroke={1.5} />
            <Group className="gap-2">
              <Text fw={600} c="#85848d">Integrate CRM</Text>
              <Text size="xs" c="#939299">
                Contact ORCA team
              </Text>
            </Group>
          </Group>
          <Text size="12px" ml={30}>Select specific leads to integrate and keep your CRM up to date with automatic syncs</Text>
        </Paper>
      </Group>

      <div className="mt-8">
        <Text size="xl" fw={600} mb="lg">
          Please upload your CSV file below
        </Text>

        <FileButton onChange={handleFileSelect} accept=".csv">
          {(props) => (
            <Button
              {...props}
              rightSection={<Image
                src="/icons/upload-2.svg"
                width={20}
                height={20}
                alt="Upload"
                className="mr-2"
              />}
              variant="outline"
              className="border-1 border-tinteddark1 bg-white hover:bg-gray-100 text-darker font-normal px-8 focus:ring-0 focus:outline-none"
              size="md"
              radius="8px"
            >
              Upload CSV file
            </Button>
          )}
        </FileButton>

        {file && (
          <Text size="sm" mt="sm" c="dimmed">
            Selected: {file.name}
          </Text>
        )}

        <Group mt="sm" align="center" gap="2px">
          <Text size="sm" c="dimmed">
            What needs to be in my CSV file?
          </Text>
          <IconInfoCircle size={20} className="text-tinteddark7" stroke={2}/>
         
        </Group>
      </div>
    </Stack>
  )
}
