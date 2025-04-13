"use client";

import { FileInput, Text, Group } from "@mantine/core";
import { IconFileSpreadsheet } from "@tabler/icons-react";
import Papa from "papaparse";
import { useState } from "react";
import { motion } from "framer-motion";
import { Contact } from "./ContactList";

interface UploadNumbersProps {
  onUpload: (contacts: Contact[]) => void;
}

export const UploadNumbers = ({ onUpload }: UploadNumbersProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);

    try {
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          const contacts = results.data as Contact[];
          const validContacts = contacts.filter((c) => c.name && c.number && c.email && c.address);
          onUpload(validContacts);
          setUploading(false);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setUploading(false);
        },
      });
    } catch (error) {
      console.error("Error processing file:", error);
      setUploading(false);
    }
  };

  return (
    <div>
      <Text size="sm" fw={500} mb="xs">
        Upload Contact List
      </Text>

      {/* Gradient wrapper */}
      <div className="gradient-horizontal-light-2 p-[2px] mb-2 rounded-[8px]">
        <FileInput
          accept=".csv"
          placeholder="Choose CSV file"
          leftSection={<IconFileSpreadsheet size={16} color="#484f62"
          />}
          onChange={handleFile}
          value={file}
          disabled={uploading}
          classNames={{
            input:
              "bg-transparent text-[#484f62] font-semibold px-8 py-2 border-none focus:ring-0 focus:outline-none placeholder-black/80",
            root: "rounded-xl",
          }}
        />
      </div>

      <Group justify="center" mt="xs">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
        >
        </motion.div>
      </Group>

      <Text size="xs" c="#8b94a9" mt="xs" ta="center">
        CSV should have <code>name</code> and <code>number</code> columns
      </Text>
    </div>
  );
};
