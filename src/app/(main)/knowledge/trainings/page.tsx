"use client";
import { Container, Text, Group, Button, Loader } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList, IconSquareRoundedPlus } from "@tabler/icons-react";
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

export default function TrainingPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [trainings, setTrainings] = useState<Training[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  useEffect(() => {
    const fetchTrainings = async () => {
      if (!campaignId) {
        toast.error("No campaign selected");
        return;
      }
      try {
        const data = await getTrainingsByCampaign(campaignId);
        setTrainings(data);
      } catch (err) {
        console.error("Failed to fetch trainings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [campaignId]);

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
            onClick={() => router.push("/knowledge/trainings/new")}
          />
        </Group>
      </Group>

      {loading ? (
        <Loader size="sm" />
      ) : view === "grid" ? (
        <TrainingGrid trainings={trainings || []} />
      ) : (
        <TrainingList trainings={trainings || []} />
      )}

      <div className="sticky bottom-0 z-30 bg-[#F4F0FF] border border-violet-200 rounded-xl shadow-sm px-6 py-4 flex items-center justify-between mt-10">
        <Text size="sm" className="text-primary font-medium">
          You have changes awaiting to be published
        </Text>
        <Button
          variant="filled"
          className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
        >
          Publish
        </Button>
      </div>
    </Container>
  );
}
