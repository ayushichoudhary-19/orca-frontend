"use client"
import { FileInput, Text, Group, Button } from "@mantine/core"
import { IconUpload, IconFileSpreadsheet } from "@tabler/icons-react"
import Papa from "papaparse"
import { useState } from "react"
import { motion } from "framer-motion"

interface UploadNumbersProps {
  onUpload: (contacts: { name: string; number: string }[]) => void
}

export const UploadNumbers = ({ onUpload }: UploadNumbersProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (selectedFile: File | null) => {
    if (!selectedFile) return

    setFile(selectedFile)
    setUploading(true)

    try {
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          const contacts = results.data as { name: string; number: string }[]
          const validContacts = contacts.filter((c) => c.name && c.number)
          onUpload(validContacts)
          setUploading(false)
        },
        error: (error) => {
          console.error("Error parsing CSV:", error)
          setUploading(false)
        },
      })
    } catch (error) {
      console.error("Error processing file:", error)
      setUploading(false)
    }
  }

  return (
    <div>
      <Text size="sm" fw={500} mb="xs">
        Upload Contact List
      </Text>

      <FileInput
        accept=".csv"
        placeholder="Choose CSV file"
        leftSection={<IconFileSpreadsheet size={16} />}
        onChange={handleFile}
        value={file}
        disabled={uploading}
      />

      <Group justify="center" mt="xs">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
          <Button
            fullWidth
            leftSection={<IconUpload size={16} />}
            variant="light"
            color="violet"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            loading={uploading}
            disabled={!file}
            size="sm"
          >
            {uploading ? "Processing..." : file ? "Upload Contacts" : "Select CSV File"}
          </Button>
        </motion.div>
      </Group>

      <Text size="xs" c="dimmed" mt="xs" ta="center">
        CSV should have name and number columns
      </Text>
    </div>
  )
}