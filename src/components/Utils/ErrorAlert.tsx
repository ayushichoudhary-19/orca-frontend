import { Alert } from "@mantine/core";

export const ErrorAlert = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <Alert radius="md" className="bg-[#fde4e1] text-[#763831]">
      {message}
    </Alert>
  );
};
