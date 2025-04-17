"use client";

import { Select, SelectProps } from "@mantine/core";

export default function CustomSelect(props: SelectProps) {
  return (
    <Select
      radius="md"
      size="md"
      styles={{
        input: {
          height: "50px",
          border: "1px solid #E7E7E9",
          borderRadius: "8px",
          padding: "0 14px",
          fontSize: "14px",
        },
        dropdown: {
          borderRadius: "8px",
        },
      }}
      {...props}
    />
  );
}
