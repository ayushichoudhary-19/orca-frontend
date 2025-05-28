"use client";

import { ActionIcon, Button, Divider, Modal, Text } from "@mantine/core";
import { Dropzone, FileRejection } from "@mantine/dropzone";
import Image from "next/image";
import { useState } from "react";
import { IconX } from "@tabler/icons-react";

interface UploadCsvModalProps {
  opened: boolean;
  onClose: () => void;
  onFileRead: (csvContent: string, filename: string) => void;
}

export default function UploadCsvModal({ opened, onClose, onFileRead }: UploadCsvModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const handleDrop = (files: File[]) => {
    const file = files[0];
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result?.toString() || "";
        setFileContent(content);
        setFilename(file.name);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to read file content");
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

  const handleCancel = () => {
    setFilename(null);
    setFileContent("");
    onClose();
  };

  const handleNext = () => {
    if (filename && fileContent) {
      onFileRead(fileContent, filename);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeButtonProps={{
        className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
        style: { border: "1.5px solid #0C0A1C" },
        size: "md"
      }}
      title={<span className="text-3xl font-bold text-[#0C0A1C] block text-center w-full mt-8">Upload File</span>}
      centered
      size="xl"
      radius="md"
      classNames={{
        body: "pb-6 pt-2 px-8",
        content: "rounded-2xl",
        header: "w-full flex justify-center pb-4 border-b border-[#E7E7E9]",
        title: "flex-1 text-center"
      }}
      styles={{
        content: {
          height: '650px',
        }
      }}
    >
      <div className="flex flex-col h-full">
        <Divider color="#E7E7E9" />
        
        <div className="flex-1 flex flex-col">
          <Dropzone
            onDrop={handleDrop}
            onReject={handleReject}
            accept={{ "text/csv": [".csv"] }}
            multiple={false}
            loading={isLoading}
            className="rounded-xl mt-8 py-12 px-4 flex flex-col items-center justify-center text-center hover:border-primary transition-colors h-[250px]"
            style={{
              border: "2px dashed #CECED2",
            }}
          >
            <Image src="/icons/upload.svg" alt="Upload Icon" width={50} height={50} />
            <Text size="sm" className="text-darker font-normal text-lg mt-2">
              Drag & drop file here or{" "}
              <span className="text-primary underline font-normal cursor-pointer">Choose files</span>
            </Text>
            {error && (
              <Text size="sm" c="red" mt="xs">
                {error}
              </Text>
            )}
          </Dropzone>

          <Text className="text-tinteddark5 mt-4 text-[15px]">Support CSV</Text>

          <div className="flex-1 min-h-[100px] mt-4">
            {filename && (
              <div className="w-[400px] rounded-lg px-4 py-3 flex items-center justify-between"
                style={{
                  border: "1px solid #E7E7E9",
                }}
              >
                <div className="flex items-center gap-3">
                  <Image src="/icons/file.svg" alt="File Icon" width={24} height={24} />
                  <div>
                    <Text className="text-md font-bold text-tinteddark7">{filename}</Text>
                    <Text className="text-tinteddark7 font-normal text-[12px]">
                      {new Blob([fileContent]).size} Bytes
                    </Text>
                  </div>
                </div>
                <ActionIcon 
                  onClick={() => setFilename(null)} 
                  className="text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white ml-4"
                  style={{
                    border: "1.5px solid #0C0A1C"
                  }}
                  size={24}
                >
                  <IconX size={16} />
                </ActionIcon>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Divider color="#E7E7E9" className="mb-6" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}
            size="md"
            radius="md"
            >
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={!filename} size="md" radius="md">
              Next
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
