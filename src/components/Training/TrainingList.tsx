"use client";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Group, Text, Button } from "@mantine/core";
import { IconEye, IconEyeOff, IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import { Training } from "@/types/training";
import { axiosClient } from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

interface TrainingListProps {
  trainings: Training[];
  setTrainings: (trainings: Training[]) => void;
  setPendingChanges: (flag: boolean) => void;
}

export const TrainingList = ({
  trainings,
  setTrainings,
  setPendingChanges,
}: TrainingListProps) => {
  const router = useRouter();
  const toggleVisibility = (id: string) => {
    const updated = trainings.map((t) =>
      t._id === id ? { ...t, isVisible: !t.isVisible } : t
    );
    setTrainings(updated);
    setPendingChanges(true);
  };  


  return (
    <Droppable droppableId="trainings" isDropDisabled = {false} isCombineEnabled={false} ignoreContainerClipping={true}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 mt-6">
          {trainings.map((training, index) => (
            <Draggable key={training._id} draggableId={training._id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                  <Card
                    withBorder
                    radius="md"
                    className={`relative p-4 transition border border-[#E7E7E9]`}
                  >
                    {/* Visibility Toggle Button */}
                    <div className="size-[42px] flex justify-center items-center absolute top-0 right-0 bg-lighter rounded-bl-3xl z-10">
                      <Button
                        size="xs"
                        p={6}
                        className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent z-20"
                        onClick={() => toggleVisibility(training._id)}
                      >
                        {training.isVisible ? (
                          <IconEyeOff size={20} className="text-darker" />
                        ) : (
                          <IconEye size={20} className="text-darker" />
                        )}
                      </Button>
                    </div>

                    {/* Dim rest of card if invisible */}
                    <div className={training.isVisible ? "" : "pointer-events-none opacity-20"}>
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
                          <Text className="font-semibold text-md text-darker mb-1">
                            {training.title}
                          </Text>

                          <Text className="mb-2 text-sm text-tinteddark6 font-normal line-clamp-2">
                            {training.description}
                          </Text>

                          <Group justify="space-between">
                            <Button
                              variant="filled"
                              className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
                              onClick={() => router.push(`/knowledge/trainings/${training._id}`)}
                            >
                              Update
                            </Button>

                            {/* Drag handle */}
                            <div {...provided.dragHandleProps}>
                              <IconGripVertical size={18} className="text-[#B7B6BB] cursor-grab" />
                            </div>
                          </Group>
                        </div>
                      </Group>
                    </div>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
