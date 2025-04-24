"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Center,
  Tooltip,
  Divider,
} from "@mantine/core";
import {
  IconTrash,
  IconPlus,
  IconScript,
  IconMessageQuestion,
  IconUser,
  IconCheckbox,
  IconBuildingStore,
  IconQuestionMark,
} from "@tabler/icons-react";
import { axiosClient } from "@/lib/axiosClient";
import NoteEditor from "../Feedback/NoteEditor";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import CustomTextInput from "../Utils/CustomTextInput";
import { toast } from "@/lib/toast";

const CONTEXT_OPTIONS = [
  {
    type: "script",
    label: "Script",
    icon: IconScript,
    description: "Add a call script for your agents",
  },
  {
    type: "objection",
    label: "Objection Handling",
    icon: IconMessageQuestion,
    description: "Common objections and how to handle them",
  },
  {
    type: "persona",
    label: "Persona",
    icon: IconUser,
    description: "Define your target customer persona",
  },
  {
    type: "qualification",
    label: "Qualification Criteria",
    icon: IconCheckbox,
    description: "Criteria to qualify prospects",
  },
  {
    type: "competition",
    label: "Competition",
    icon: IconBuildingStore,
    description: "Information about competitors",
  },
  {
    type: "faq",
    label: "FAQ",
    icon: IconQuestionMark,
    description: "Frequently asked questions",
  },
];

export default function ContextEditorPanel({ campaignId }: { campaignId: string }) {
  const [contexts, setContexts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomTitle, setNewCustomTitle] = useState("");
  const [pendingChanges, setPendingChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletedContextIds, setDeletedContextIds] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    axiosClient
      .get(`/api/contexts/campaign/${campaignId}`)
      .then((res) => {
        setContexts(res.data);
      })
      .finally(() => setIsLoading(false));
  }, [campaignId]);

  const addContextDraft = (type: string, title?: string) => {
    const tempId = uuidv4();
    const draft = {
      _id: tempId,
      isDraft: true,
      type,
      title: title || type,
      content: "",
    };
    setContexts((prev) => [...prev, draft]);
    setPendingChanges(true);
  };

  const handleEditorSave = (id: string, content: string) => {
    setContexts((prev) => prev.map((ctx) => (ctx._id === id ? { ...ctx, content } : ctx)));
    setPendingChanges(true);
  };

  const handleDelete = (id: string) => {
    const ctx = contexts.find((ctx) => ctx._id === id);
    if (ctx && !ctx.isDraft) {
      setDeletedContextIds((prev) => [...prev, id]);
    }
    setContexts((prev) => prev.filter((ctx) => ctx._id !== id));
    setPendingChanges(true);
  };

  const handlePublish = async () => {
    for (const id of deletedContextIds) {
      await axiosClient.delete(`/api/contexts/${id}`);
    }

    const promises = contexts.map(async (ctx) => {
      if (!ctx.content || ctx.content.trim() === "") {
        toast.error(`Please fill out content for "${ctx.title}"`);
        throw new Error("Empty context found");
      }
      if (ctx.isDraft) {
        return axiosClient.post("/api/contexts", {
          campaignId,
          type: ctx.type,
          title: ctx.title,
          content: ctx.content,
        });
      } else {
        return axiosClient.put(`/api/contexts/${ctx._id}`, { content: ctx.content });
      }
    });

    await Promise.all(promises);
    setPendingChanges(false);
    setDeletedContextIds([]);
    const res = await axiosClient.get(`/api/contexts/campaign/${campaignId}`);
    setContexts(res.data);
  };

  const getAvailableOptions = () =>
    CONTEXT_OPTIONS.filter((opt) => !contexts.some((ctx) => ctx.type === opt.type && !ctx.isDraft));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Text className="text-2xl font-bold text-darker">Additional Context</Text>

        <Button
          variant="outline"
          leftSection={<IconPlus size={16} />}
          onClick={() => setShowModal(true)}
          size="md"
          className="border-light hover:bg-lighter rounded-lg px-4 py-2"
        >
          Add Custom Resource
        </Button>
      </div>

      <AnimatePresence>
        {getAvailableOptions().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Text className="text-sm font-medium text-darker mb-4">Available Context Types</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getAvailableOptions().map((opt) => (
                <motion.div key={opt.type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    radius="md"
                    className="cursor-pointer hover:border-lighter hover:shadow-sm transition-all duration-200 bg-white"
                    onClick={() => addContextDraft(opt.type, opt.label)}
                  >
                    <Group>
                      <div className="w-10 h-10 rounded-full bg-lighter flex items-center justify-center text-primary">
                        <opt.icon size={20} />
                      </div>
                      <div>
                        <Text className="font-medium">{opt.label}</Text>
                        <Text size="xs" className="text-gray-500 line-clamp-1">
                          {opt.description}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contexts.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card withBorder radius="md" className="py-16 bg-white border-none">
              <Center className="flex-col text-center">
                <Text size="lg" className="font-semibold text-darker mb-2">
                  No context resources yet
                </Text>
                <Text size="sm" className="text-tinteddark7 max-w-md mx-auto mb-6">
                  Start by adding a script or any other context for your campaign. These resources
                  will help your agents during calls.
                </Text>
                <Group justify="center">
                  {CONTEXT_OPTIONS.slice(0, 3).map((opt) => (
                    <Button
                      key={opt.type}
                      variant="light"
                      leftSection={<opt.icon size={16} stroke={2} />}
                      onClick={() => addContextDraft(opt.type, opt.label)}
                    >
                      Add {opt.label}
                    </Button>
                  ))}
                </Group>
              </Center>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      {contexts.map((ctx, index) => (
        <Card radius="md" key={index} className="relative bg-transparent">
          <Group justify="space-between" mb="xs">
            <Text className="font-semibold text-lg">{ctx.title}</Text>

            <Tooltip label="Delete">
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => handleDelete(ctx._id)}
                className="hover:bg-red-50"
              >
                <IconTrash size={16} stroke={2} />
              </Button>
            </Tooltip>
          </Group>

          <NoteEditor content={ctx.content} onChange={(val) => handleEditorSave(ctx._id, val)} />
        </Card>
      ))}

      <AnimatePresence>
        {pendingChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="sticky bottom-0 z-30 bg-[#F4F0FF] border border-violet-200 rounded-xl shadow-sm px-6 py-4 flex items-center justify-between mt-10">
              <Text size="sm" className="text-primary font-medium">
                You have changes waiting to be published
              </Text>

              <Button
                variant="filled"
                className="h-[40px] px-[20px] py-[10px] rounded-[12px] font-normal"
                onClick={handlePublish}
              >
                Publish
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        closeButtonProps={{
          className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
          style: { border: "1.5px solid #0C0A1C" },
          size: "md",
        }}
        title={
          <span className="text-3xl font-bold text-[#0C0A1C] block text-center w-full mt-8">
            Create Custom Resource
          </span>
        }
        centered
        size="xl"
        radius="md"
        classNames={{
          body: "pb-6 pt-2 px-8",
          content: "rounded-2xl",
          header: "w-full flex justify-center pb-4 border-b border-[#E7E7E9]",
          title: "flex-1 text-center",
        }}
        styles={{
          content: {
            height: "350px",
          },
        }}
      >
        <Divider color="#E7E7E9" />
        <Stack mt={20}>
          <label className="block text-md font-semibold text-darker">Resource Name *</label>
          <CustomTextInput
            placeholder="e.g. Additional Tips"
            value={newCustomTitle}
            onChange={(e) => setNewCustomTitle(e.currentTarget.value)}
          />
          <Group className="mt-4" justify="flex-end">
            <Button variant="outline" radius={"md"} onClick={() => setShowModal(false)} size="md">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newCustomTitle.trim()) {
                  addContextDraft("custom", newCustomTitle);
                  setNewCustomTitle("");
                  setShowModal(false);
                }
              }}
              variant="filled"
              radius={"md"}
              size="md"
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
