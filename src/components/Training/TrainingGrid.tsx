"use client";
import { Button, Card, Group, Text } from "@mantine/core";
import { IconEye, IconEyeOff, IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import { Training } from "@/types/training";

interface TrainingGridProps {
  trainings: Training[];
}

export const TrainingGrid = ({ trainings }: TrainingGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {trainings.map((training) => (
        <Card
          key={training._id}
          className={`relative p-4 transition border border-[#E7E7E9] ${
            !training.isVisible ? "opacity-20 pointer-events-none" : ""
          }`}
          withBorder
          radius="md"
        >
          <div className="size-[42px] flex justify-center items-center absolute top-0 right-0 bg-lighter rounded-bl-3xl z-10">
            {training.isVisible ? (
              <IconEye size={20} className="text-darker" />
            ) : (
              <IconEyeOff size={20} className="text-darker" />
            )}
          </div>
          <Image
            src={`/${training.type}.png`}
            alt={training.title}
            width={300}
            height={100}
            className="object-contain mb-5"
          />

          <Text className="font-semibold text-md text-darker mb-2">{training.title}</Text>

          <Text
            size="sm"
            c="dimmed"
            className="mb-3 text-base text-tindeddark6 font-normal line-clamp-2"
          >
            {training.description}
          </Text>

          <Group justify="space-between">
            <Button
              variant="filled"
              className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
            >
              Update
            </Button>
            <IconGripVertical size={18} className="text-[#B7B6BB] cursor-grab" />
          </Group>
        </Card>
      ))}
    </div>
  );
};
