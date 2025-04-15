"use client";

import { Modal, Text } from "@mantine/core";
import { Dropzone, FileRejection } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";

interface UploadCsvModalProps {
  opened: boolean;
  onClose: () => void;
  onFileRead: (csvContent: string, filename: string) => void;
}

export default function UploadCsvModal({ opened, onClose, onFileRead }: UploadCsvModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result?.toString() || "";
        onFileRead(content, file.name);
        onClose();
      } catch (err) {
        console.error(err);
        setError("Failed to read file content");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleReject = (fileRejections: FileRejection[]) => {
    console.error(fileRejections);
    setError("Please upload a valid CSV file");
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Upload File" centered size="lg">
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        accept={{ "text/csv": [".csv"] }}
        multiple={false}
        loading={isLoading}
      >
        <div className="p-8 border border-dashed rounded-md text-center">
          <IconUpload size={40} className="mx-auto mb-3 text-purple-600" />
          <Text size="sm" c="dimmed">
            Drag & drop file here or <span className="text-purple-500 font-medium">Choose files</span>
          </Text>
          {error && <Text size="sm" c="red" mt="sm">{error}</Text>}
        </div>
      </Dropzone>
    </Modal>
  );
}