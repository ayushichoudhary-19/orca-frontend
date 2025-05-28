"use client";
import { Button } from "@mantine/core";
import { ReactNode } from "react";

interface ViewToggleButtonProps {
  active?: boolean;
  icon: ReactNode;
  onClick: () => void;
}

export const ViewToggleButton = ({ active, icon, onClick }: ViewToggleButtonProps) => {
  return (
    <Button
      variant="default"
      h={50}
      w={50}
      p={0}
      radius={8}
      className={active ? "bg-lighter" : "bg-white"}
      style={{
        border: active ? "1px solid #6D57FC" : "1px solid #E7E7E9",
        color: active ? "#6D57FC" : "#261E58",
      }}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};
