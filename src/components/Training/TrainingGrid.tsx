"use client";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Card, Group, Text } from "@mantine/core";
import { IconEye, IconEyeOff, IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import { Training } from "@/types/training";
import { useRouter } from "next/navigation";

interface TrainingGridProps {
  trainings: Training[];
  setTrainings: (trainings: Training[]) => void;
  setPendingChanges: (flag: boolean) => void;
}

export const TrainingGrid = ({
  trainings,
  setTrainings,
  setPendingChanges,
}: TrainingGridProps): React.ReactNode => {
  const router = useRouter();
  const toggleVisibility = (id: string) => {
    const updated = trainings.map((t) =>
      t._id === id ? { ...t, isVisible: !t.isVisible } : t
    );
    setTrainings(updated);
    setPendingChanges(true);
  };  

  return (
    <Droppable
      droppableId="trainings"
      direction="horizontal"
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={true}
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6"
        >
          {trainings.map((training, index) => (
            <Draggable key={training._id} draggableId={training._id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                  <Card
                    className={`relative p-4 transition border border-[#E7E7E9]`}
                    withBorder
                    radius="md"
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

                    <div className={training.isVisible ? "" : "pointer-events-none opacity-20"}>
                      {training.type ? (
                        <Image
                          src={`/${training.type}.png`}
                          alt={training.title}
                          width={300}
                          height={100}
                          className="object-contain mb-5"
                        />
                      ) : (
                        <div className="w-full h-[100px] rounded-[12px] bg-[#F5F5F7] mb-5 border border-dashed border-[#DDD] flex items-center justify-center text-sm text-muted-foreground">
                          No Image
                        </div>
                      )}

                      <Text className="font-semibold text-[18px] text-darker mb-2">
                        {training.title}
                      </Text>

                      <Text
                        size="sm"
                        c="dimmed"
                        className="mb-3 text-base text-tinteddark6 font-normal line-clamp-2"
                      >
                        {training.description}
                      </Text>

                      <Group justify="space-between">
                        <Button
                          variant="filled"
                          className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
                          onClick={() => {
                            router.push(`/knowledge/trainings/${training._id}`);
                          }}
                        >
                          Update
                        </Button>
                        <div {...provided.dragHandleProps}>
                          <IconGripVertical size={18} className="text-[#B7B6BB] cursor-grab" />
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
