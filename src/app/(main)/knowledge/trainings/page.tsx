"use client";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Container, Text, Group, Button, Modal, Stack } from "@mantine/core";
import {
  IconArrowRight,
  IconLayoutGrid,
  IconLayoutList,
  IconSquareRoundedPlus,
} from "@tabler/icons-react";
import { TrainingHero } from "@/components/Training/TrainingHero";
import { TrainingGrid } from "@/components/Training/TrainingGrid";
import { TrainingList } from "@/components/Training/TrainingList";
import { ViewToggleButton } from "@/components/Training/ViewToggleButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getTrainingsByCampaign } from "@/hooks/Training/useTraining";
import { Training } from "@/types/training";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "@/lib/toast";
import { axiosClient } from "@/lib/axiosClient";
import Loader from "@/components/Utils/Loader";
import { createTraining } from "@/hooks/Training/useTraining";
import CustomTextInput from "@/components/Utils/CustomTextInput";

export default function TrainingPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [trainings, setTrainings] = useState<Training[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [originalTrainings, setOriginalTrainings] = useState<Training[] | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const fetchTrainings = async () => {
    if (!campaignId) {
      toast.error("No campaign selected");
      return;
    }
    try {
      const data = await getTrainingsByCampaign(campaignId);
      setTrainings(data);
      setOriginalTrainings(JSON.parse(JSON.stringify(data)));
      setPendingChanges(false);

    } catch (err) {
      console.error("Failed to fetch trainings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [campaignId]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !trainings) return;
  
    const reordered = Array.from(trainings);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
  
    setTrainings(reordered);
    setPendingChanges(true);
  };
  

  const handlePublish = async () => {
    if (!trainings) return;
  
    try {
      const orderPayload = trainings.map((t, i) => ({
        id: t._id,
        sortOrder: i,
      }));
  
      const visibilityPayload = trainings.map((t) => ({
        id: t._id,
        isVisible: t.isVisible,
      }));
  
      await axiosClient.post("/api/trainings/reorder", { order: orderPayload });
      await axiosClient.post("/api/trainings/visibility-bulk", { updates: visibilityPayload });
  
      toast.success("Changes published!");
      fetchTrainings();
    } catch (err) {
      toast.error("Failed to publish changes");
      console.error(err);
    }
  };
  
  const handleModalSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill out both fields");
      return;
    }

    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }

    try {
      const res = await createTraining({
        title,
        description,
        content: {
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
        },
        campaignId,
        lastEditedBy: userId,
      });
      toast.success("Training created!");
      router.push(`/knowledge/trainings/${res._id}`);
    } catch (err) {
      toast.error("Failed to create training");
      console.error(err);
    }
  };

  const handleSave = async ({ content }: { content: any }) => {
    if (!campaignId) {
      toast.error("Please select a campaign");
      return;
    }
    try {
      const res = await createTraining({
        title,
        description,
        content,
        campaignId,
        lastEditedBy: userId,
      });
      toast.success("Training created!");
      router.push(`/knowledge/trainings/${res._id}`);
    } catch (err) {
      toast.error("Failed to create training");
      console.error(err);
    }
  };

  return (
    <Container size="xl" className="pt-3 pb-[30px]">
      <TrainingHero />

      <Group justify="space-between" className="mb-5">
        <div>
          <Text className="text-3xl font-bold mb-1 text-darker">Training</Text>
          <Text className="text-tinteddark6 text-base">
            Complete each training section to help callers understand the product background and
            campaign requirements
          </Text>
        </div>

        <Group gap="xs">
          <ViewToggleButton
            active={view === "grid"}
            icon={<IconLayoutGrid size={22} stroke={1.5} />}
            onClick={() => setView("grid")}
          />
          <ViewToggleButton
            active={view === "list"}
            icon={<IconLayoutList size={22} stroke={1.5} />}
            onClick={() => setView("list")}
          />
          <ViewToggleButton
            icon={<IconSquareRoundedPlus size={22} stroke={1.5} />}
            onClick={() => setModalOpened(true)}
          />
        </Group>
      </Group>

      <DragDropContext onDragEnd={handleDragEnd}>
      {loading ? (
  <Loader />
) : view === "grid" ? (
  <TrainingGrid
    trainings={trainings || []}
    setTrainings={setTrainings}
    setPendingChanges={setPendingChanges}
  />
) : (
  <TrainingList
    trainings={trainings || []}
    setTrainings={setTrainings}
    setPendingChanges={setPendingChanges}
  />
)}

      </DragDropContext>

      {pendingChanges && (
  <div className="sticky bottom-0 z-30 bg-[#F4F0FF] border border-violet-200 rounded-xl shadow-sm px-6 py-4 flex items-center justify-between mt-10">
    <Text size="sm" className="text-primary font-medium">
      You have changes awaiting to be published
    </Text>
    <Button
      variant="filled"
      className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
      onClick={handlePublish}
    >
      Publish
    </Button>
  </div>
)}


      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create New Training"
        centered
        size="lg"
        radius="md"
        overlayProps={{ blur: 2 }}
      >
        <Stack>
          <label className="block text-sm font-semibold text-darker">Training Title *</label>
          <CustomTextInput
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
            className="h-[50px]"
          />
          <label className="block text-sm font-semibold text-darker">Training Description *</label>
          <CustomTextInput
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            required
            className="h-[50px]"
          />
          <Group justify="flex-end" mt="sm">
            <Button
              rightSection={<IconArrowRight size={18} />}
              variant="filled"
              className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
              onClick={handleModalSubmit}
            >
              Continue
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
