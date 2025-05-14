"use client";

import { Modal, Button, Text, Divider } from "@mantine/core";
import { useState } from "react";
import CustomTextInput from "../Utils/CustomTextInput";
import { IconTrash } from "@tabler/icons-react";
import { axiosClient } from "@/lib/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "@/lib/toast";

export default function AuditionSetupModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [questions, setQuestions] = useState<string[]>([""]);
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleSave = async () => {
    try {
      await axiosClient.post(`/api/auditions/${campaignId}/questions`, {
        campaignId,
        questions,
      });
      toast.success("Audition questions saved successfully.");
      onClose();
    } catch (err) {
      toast.error("Failed to save audition questions.");
      console.error(err);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeButtonProps={{
        className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
        style: { border: "1.5px solid #0C0A1C" },
        size: "md",
      }}
      title={
        <span className="text-3xl font-bold text-[#0C0A1C] block text-center w-full mt-8">
          Objection Handling Caller Interview Questions
        </span>
      }
      centered
      size="xl"
      radius="md"
      classNames={{
        body: "pb-0 pt-2 px-8",
        content: "rounded-2xl",
        header: "w-full flex justify-center pb-4 border-b border-[#E7E7E9]",
        title: "flex-1 text-center",
      }}
      styles={{
        content: {
          height: "650px",
        },
      }}
    >
      <div className="flex flex-col h-full">
        <Text className="text-tinteddark5 text-[16px] mb-4 text-center">
          Specify the objections you want potential callers for your campaign to answer. Their
          responses to the objections will be recorded (audio only) to be reviewed by you.
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
          <Button
            size="md"
            radius="md"
            className="my-6 font-normal w-fit"
            onClick={addQuestion}
          >
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
