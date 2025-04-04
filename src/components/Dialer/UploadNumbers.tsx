'use client';
import { FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import Papa from 'papaparse';

interface UploadNumbersProps {
  onUpload: (contacts: { name: string; number: string }[]) => void;
}

export const UploadNumbers = ({ onUpload }: UploadNumbersProps) => {
  const handleFile = (file: File | null) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const contacts = results.data as { name: string; number: string }[];
        onUpload(contacts.filter(c => c.name && c.number));
      }
    });
  };

  return (
    <FileInput
      label="Upload CSV"
      accept=".csv"
      placeholder="Choose CSV file"
      leftSection={<IconUpload size={16} />}
      onChange={handleFile}
    />
  );
};
