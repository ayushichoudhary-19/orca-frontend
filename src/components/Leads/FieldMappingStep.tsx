"use client";

import { useState } from "react";
import { Button, Select, Stack, Text, Group, Paper, Modal, Divider } from "@mantine/core";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "react-hot-toast";
import { IconBuildings, IconMail, IconPhone, IconUsers, IconWallet } from "@tabler/icons-react";
import CustomBadge from "./CustomBadge";
import { useRouter } from "next/navigation";

const orcaFields = [
  "Prospect First Name",
  "Prospect Last Name",
  "Prospect Title",
  "Prospect Email",
  "Prospect Phone Number",
  "Account Name",
  "Account HQ State",
  "Account Industry",
  "Prospect Mobile Number",
  "Prospect LinkedIn URL",
  "Account Website",
  "Account HQ City",
  "Account Employee Count",
  "Account Revenue",
  "Account Executive Email",
];

export default function FieldMappingStep({
  file,
  csvRows,
  campaignId,
}: {
  file: File;
  csvRows: any[];
  campaignId: string;
}) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const csvHeaders = Object.keys(csvRows[0] || {});
  const router = useRouter();

  const updateMap = (field: string, source: string) => {
    setMapping((prev) => ({ ...prev, [field]: source }));
  };

  const handleSubmit = async () => {
    setConfirmModalOpen(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("campaignId", campaignId);
    formData.append("fieldMapping", JSON.stringify(mapping));

    setIsSubmitting(true);
    try {
      await axiosClient.post("/api/leads/upload", formData);
      toast.success("Leads uploaded successfully!");
      router.push('/leads/ingestions');
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  return (
    <>
      <Stack maw={1200} mx="auto" px="lg" py="xl" gap="lg">
        <Group justify="space-between" align="center">
          <Text fw={700} className="text-[32px] text-darker">
            Ingestion field mapping
          </Text>
          <CustomBadge label="Lead Health" value="30 days left" />
        </Group>
        <Divider />
        <div>
          <Text size="xl" fw={600}>
            Map your fields
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            Provide callers with context by specifying which ORCA fields map with those from your
            CRM/CSV (* indicates required field)
          </Text>
        </div>

        <div className="flex gap-8">
          <div className="flex-grow space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text fw={600}>ORCA Field</Text>
              </div>
              <div className="flex">
                <Text fw={600} className="flex-grow">
                  Field from your source
                </Text>
                {/* <Text fw={600} className="text-primary">Auto mapped</Text> */}
              </div>
            </div>

            {orcaFields.map((field, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div
                  style={{
                    backgroundColor: "#E7E7E9",
                    color: "#3D3B49",
                    fontSize: "14px",
                  }}
                  className="bg-gray-100 rounded-[8px] px-[10px] py-[16px] h-[50px] flex items-center text-sm font-medium"
                >
                  {field}{" "}
                  {field.includes("Name") || field.includes("Email") || field.includes("Title")
                    ? "*"
                    : ""}
                </div>
                <Select
                  data={csvHeaders}
                  placeholder="Select from source"
                  value={mapping[field] || ""}
                  onChange={(val) => updateMap(field, val!)}
                  styles={{
                    input: {
                      height: 50,
                      padding: "16px 15px 16px 10px",
                      borderRadius: "8px",
                      borderColor: mapping[field] ? "#6D57FC" : "#d1d5db",
                    },
                  }}
                />
              </div>
            ))}

            <Button
              fullWidth
              size="md"
              mt="xl"
              fw={400}
              radius="12px"
              c={"#E8E4FF"}
              leftSection={<span className="text-lg">+</span>}
            >
              Map more useful signals to show on contact card
            </Button>
          </div>

          {/* Preview card column */}
          <div className="w-1/3">
            <div className="sticky top-4">
              <Paper withBorder p="md" radius="md">
                <div className="space-y-2">
                  <Text size="32px" className="text-darker" fw={600}>
                    John Doe
                  </Text>
                  <Text size="sm" fw={600} className="text-tinteddark7">
                    Vice President <span className="text-[#6D57FC]">@loremipsum</span>
                  </Text>

                  <Divider />
                  <Text size="sm" fw={600} mt="md">
                    About Lorem Co
                  </Text>
                  <Group gap="xs">
                    <CustomBadge icon={<IconUsers size={14} />} value="50–1000" />
                    <CustomBadge icon={<IconBuildings size={14} />} value="Plastics" />
                    <CustomBadge icon={<IconWallet size={14} />} value="$5M" />
                    <CustomBadge icon={<IconWallet size={14} />} value="Delaware, undefined" />{" "}
                  </Group>

                  <Text size="sm" fw={600} mt="md">
                    Contact Info
                  </Text>
                  <Group gap="xs">
                    <CustomBadge icon={<IconPhone size={14} />} value="123-123-1234" />
                    <CustomBadge icon={<IconMail size={14} />} value="example@orca.com" />{" "}
                  </Group>
                </div>
              </Paper>
              <Text size="xs" c="#555461" mt="md">
                This is how your lead information will be displayed to cold callers.
              </Text>
              <Group justify="right" mt="xl">
                <Button
                  variant="outline"
                  size="md"
                  radius="12px"
                  onClick={() => window.location.reload()}
                >
                  Start over
                </Button>
                <Button size="md" radius="12px" loading={isSubmitting} onClick={openConfirmModal}>
                  Next
                </Button>
              </Group>

              <Modal
                opened={confirmModalOpen}
                closeButtonProps={{
                  className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
                  style: { border: "1px solid #0C0A1C" },
                  size: "sm",
                }}
                onClose={() => setConfirmModalOpen(false)}
                title={
                  <Text size="lg" fw={600} c="#1C1D22">
                    Are your mappings correct?
                  </Text>
                }
                classNames={{
                  body: "pb-5 text-[#555461] text-sm",
                  content: "rounded-2xl",
                  header: "w-full flex border-b border-[#E7E7E9]",
                  title: "flex-1",
                }}
                centered
                padding="lg"
              >
                <Text size="sm" mb="lg">
                  Please double check your mappings as you will need to start over if you would like
                  to make any changes
                </Text>

                <Group justify="left" gap="md">
                  <Button
                    variant="outline"
                    radius="12px"
                    fw={400}
                    onClick={() => setConfirmModalOpen(false)}
                  >
                    View mappings
                  </Button>
                  <Button onClick={handleSubmit} radius="12px" fw={400}>
                    Yes, they are correct
                  </Button>
                </Group>
              </Modal>
            </div>
          </div>
        </div>
      </Stack>
    </>
  );
}
