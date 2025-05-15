"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Divider,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import CustomTextInput from "../Utils/CustomTextInput";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "@/lib/toast";

export default function AuditionSetupModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [questions, setQuestions] = useState<string[]>([]);

  // Fetch existing questions when modal opens
  useEffect(() => {
    if (!opened || !campaignId) return;

    const fetchQuestions = async () => {
      try {
        const res = await axiosClient.get(`/api/auditions/${campaignId}/questions`);
        if (res.data?.length > 0) {
          setQuestions(res.data.map((q: any) => q.question));
        } else {
          setQuestions([""]);
        }
      } catch (err) {
        console.error("Failed to fetch questions", err);
        toast.error("Could not load existing audition questions.");
        setQuestions([""]);
      } 
    };

    fetchQuestions();
  }, [opened, campaignId]);

  const handleQuestionChange = (index: number, value: string) => {
    const newQs = [...questions];
    newQs[index] = value;
    setQuestions(newQs);
  };

  const addQuestion = () => setQuestions([...questions, ""]);

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQs = questions.filter((_, i) => i !== index);
      setQuestions(newQs);
    }
  };

  const handleSave = async () => {
    try {
      await axiosClient.post(`/api/auditions/${campaignId}/questions`, {
        questions,
      });
      toast.success("Audition questions saved successfully.");
      onClose();
    } catch (err) {
      console.error("Error saving questions", err);
      toast.error("Failed to save audition questions.");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="xl"
      radius="md"
      title={
        <span className="text-3xl font-bold text-[#0C0A1C] block text-center w-full mt-8">
          Objection Handling Caller Interview Questions
        </span>
      }
      closeButtonProps={{
        className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
        style: { border: "1.5px solid #0C0A1C" },
        size: "md",
      }}
      classNames={{
        body: "pb-0 pt-2 px-8",
        content: "rounded-2xl",
        header: "w-full flex justify-center pb-4 border-b border-[#E7E7E9]",
        title: "flex-1 text-center",
      }}
      styles={{ content: { height: "650px" } }}
    >
      <div className="flex flex-col h-full">
        <Text className="text-tinteddark5 text-[16px] mb-4 text-center">
          Specify the objections you want potential callers to answer. Their audio responses will be reviewed by you.
        </Text>
        <Divider color="#E7E7E9" />

        <div className="flex-1 overflow-auto py-2">
          {questions.map((question, index) => (
            <div key={index} className="relative">
              <label className="text-tinteddark7 text-[18px] mt-4 block">
                Audition Question {index + 1}
              </label>
              <div className="flex gap-2">
                <CustomTextInput
                  placeholder='e.g. The lead says "We already have a commercial insurance policy."'
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.currentTarget.value)}
                  className="my-2 flex-1"
                />
                {questions.length > 1 && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="sm"
                    radius="md"
                    className="my-2 p-2"
                    onClick={() => removeQuestion(index)}
                  >
                    <IconTrash size={15} />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button size="md" radius="md" className="my-6 font-normal w-fit" onClick={addQuestion}>
            Add audition question
          </Button>
        </div>

        <div className="sticky bottom-0 bg-white pt-4">
          <Divider color="#E7E7E9" />
          <div className="flex justify-end gap-3 py-6">
            <Button variant="outline" onClick={onClose} size="md" radius="md">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              size="md"
              radius="md"
              disabled={questions.some((q) => !q.trim())}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
