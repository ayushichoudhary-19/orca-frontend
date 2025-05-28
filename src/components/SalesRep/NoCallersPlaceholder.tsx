"use client";

import { Button, Text } from "@mantine/core";
import { usePathname } from "next/navigation";

export default function NoCallersPlaceholder({ onClick }: { onClick: () => void }) {
  const pathname = usePathname();

  const getContent = () => {
    if (pathname?.includes("/active")) {
      return {
        title: "No Approved Callers Yet",
        description: "You don't have any approved callers yet. But that's okay, our community is working hard on the qualification criteria and will submit auditions soon."
      };
    } else if (pathname?.includes("/pending")) {
      return {
        title: "No Pending Auditions",
        description: "There are no callers who have submitted auditions yet. Once callers submit their auditions, they will appear here for your review."
      };
    } else if (pathname?.includes("/blocked")) {
      return {
        title: "No Blocked Callers",
        description: "You haven't blocked any callers yet. Blocked callers will appear here when you restrict/reject their access to your campaign."
      };
    }
    return {
      title: "No Callers Yet",
      description: "You don't have any callers yet. But that's okay, our community is working hard on the qualification criteria and will submit auditions soon."
    };
  };

  const content = getContent();

  return (
    <div className="text-center my-16 bg-white p-20">
      <Text fw={600} size="lg" mb={8}>{content.title}</Text>
      <Text c="dimmed" mb={16}>
        {content.description} See how the audition process works
      </Text>
      <Button 
        variant="filled" 
        radius="md"
        size="md"
        className="font-normal text-[16px]"
        onClick={onClick}
      >
        See how the audition process works
      </Button>
    </div>
  );
}
