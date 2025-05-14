"use client";

import { useEffect, useState } from "react";
import { Button, Container, Divider } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import PendingRepsTable from "@/components/SalesRep/PendingRepsTable";
import NoCallersPlaceholder from "@/components/SalesRep/NoCallersPlaceholder";
import AuditionSetupModal from "@/components/SalesRep/AuditionSetupModal";
import { axiosClient } from "@/lib/axiosClient";
import AuditionCarousel from "@/components/SalesRep/AuditionCarouselModal";

export default function PendingRepsPage() {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const fetchReps = async () => {
      try {
        const res = await axiosClient.get(`/api/auditions/${campaignId}/reps`);
        setReps(res.data);
      } catch (err) {
        console.error("Error fetching pending reps", err);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchReps();
  }, [campaignId]);

  return (
    <Container size="xl" className="py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pending Reps</h1>
        <Button
          size="md"
          radius="md"
          className="my-6 font-normal w-fit"
          onClick={() => setShowSetup(true)}
        >
          Audition setup
        </Button>
      </div>

      <Divider className="mb-6"/>


      {loading ? null : reps.length > 0 ? (
        <PendingRepsTable reps={reps} />
      ) : (
        <NoCallersPlaceholder onClick={() => setShowCarousel(true)} />
      )}

      {showCarousel && <AuditionCarousel onClose={() => setShowCarousel(false)} />}
      <AuditionSetupModal opened={showSetup} onClose={() => setShowSetup(false)} />
    </Container>
  );
}
