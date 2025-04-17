"use client";
import { Card, Group, Text, Button } from "@mantine/core";
import { IconEye, IconEyeOff, IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import { Training } from "@/types/training";

interface TrainingListProps {
  trainings: Training[];
}

export const TrainingList = ({ trainings }: TrainingListProps) => {
  return (
    <div className="space-y-4 mt-6">
      {trainings.map((training) => (
        <Card
          key={training._id}
          withBorder
          radius="md"
          className={`relative p-4 transition border border-[#E7E7E9] ${
            !training.isVisible ? "opacity-20 pointer-events-none" : ""
          }`}
        >
          <div className="size-[42px] flex justify-center items-center absolute top-0 right-0 bg-lighter rounded-bl-3xl z-10">
            {training.isVisible ? (
              <IconEye size={20} className="text-darker" />
            ) : (
              <IconEyeOff size={20} className="text-darker" />
            )}
          </div>

          <Group align="start" className="w-full gap-6">
            <div className="min-w-[300px] h-[100px] bg-[#CCCCCC33] rounded-[6px] flex items-center justify-center overflow-hidden">
              <Image
                src={`/${training.type}.png`}
                alt={training.title}
                width={300}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <Text className="font-semibold text-md text-darker mb-2">{training.title}</Text>

              <Text className="mb-3 text-base text-tindeddark6 font-normal line-clamp-2">
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
            </div>
          </Group>
        </Card>
      ))}
    </div>
  );
};
