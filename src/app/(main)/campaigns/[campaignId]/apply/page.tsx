"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconCheck, IconLock } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { axiosClient } from "@/lib/axiosClient";
import { Button, Divider, Paper, Text } from "@mantine/core";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import AudioRecorderForQuestion from "@/components/ApplyPage/AudioRecorderForQuestion";
import { toast } from "@/lib/toast";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type AuditionStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "retry"
  | "approved"
  | "rejected";

export default function ApplyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [experience, setExperience] = useState("");
  const [country, setCountry] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [audioResponses, setAudioResponses] = useState<Record<string, Blob | null>>({});
  const [auditionStatus, setAuditionStatus] = useState<AuditionStatus | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState<string | null>(null);

  const campaignId = usePathname().split("/")[2];
  const salesRepId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const [questionRes, statusRes] = await Promise.all([
          axiosClient.get(`/api/auditions/${campaignId}/questions`),
          axiosClient.get(`/api/auditions/${campaignId}/status/${salesRepId}`),
        ]);

        setQuestions(questionRes.data || []);
        setAuditionStatus(statusRes.data?.auditionStatus);
        setFeedbackNotes(statusRes.data?.retryReason || null);
        const initialAudioResponses: Record<string, Blob | null> = {};

        (statusRes.data.auditionResponses || []).forEach((res: any) => {
          initialAudioResponses[res.questionId] = res.audioUrl;
        });

        setAudioResponses(initialAudioResponses);
      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId && salesRepId) {
      fetchDetails();
    }
  }, [campaignId, salesRepId]);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeUrl(URL.createObjectURL(file));
    }
  };

  const handleAudioRecorded = (questionId: string, blob: Blob | null) => {
    setAudioResponses((prev) => ({ ...prev, [questionId]: blob }));
  };

  const isEditable = ["not_started", "in_progress", "retry"].includes(auditionStatus || "");
  const canEditInputs = auditionStatus === "in_progress";
  const isRetry = auditionStatus === "retry";
  const getPreviousAudioUrl = (response: Blob | string | null | undefined): string | undefined => {
    return typeof response === "string" ? response : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditable) {
      toast.error("You cannot submit again unless your status is set to 'retry'.");
      return;
    }
    if (canEditInputs) {
      if (
        !experience ||
        !country ||
        !linkedin ||
        !questions.every((q) => !!audioResponses[q._id]) ||
        !resumeFile
      ) {
        toast.error("Please complete all fields and record all audio answers.");
        return;
      }
    } else {
      const allQuestionsAnswered = questions.every((q) => !!audioResponses[q._id]);
      if (!allQuestionsAnswered) {
        toast.error("Please record all audio answers.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      let resumeS3Key = resumeUrl;
      if (canEditInputs && resumeFile) {
        const resumeForm = new FormData();
        resumeForm.append("file", resumeFile);
        resumeForm.append("folder", "resumes");
        const resumeUploadRes = await axiosClient.post("/api/uploads/upload", resumeForm);
        resumeS3Key = resumeUploadRes.data.key;
      }

      const uploadedAudioUrls: { questionId: string; audioUrl: string }[] = [];

      for (const q of questions) {
        const blob = audioResponses[q._id];
        if (blob) {
          const formData = new FormData();
          formData.append("file", blob, `audio-${q._id}.webm`);
          formData.append("folder", "auditions");
          const audioRes = await axiosClient.post("/api/uploads/upload", formData);
          uploadedAudioUrls.push({ questionId: q._id, audioUrl: audioRes.data.key });
        }
      }

      const payload = canEditInputs
        ? {
            salesRepId,
            responses: uploadedAudioUrls,
            resumeUrl: resumeS3Key,
            experienceYears: experience,
            country,
            linkedInUrl: linkedin,
          }
        : {
            salesRepId,
            responses: uploadedAudioUrls,
          };

      await axiosClient.post(`/api/auditions/${campaignId}/submit`, payload);
      toast.success(
        isRetry ? "Audition resubmitted successfully!" : "Application submitted successfully!"
      );
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed. Check console and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/campaigns/${campaignId}/training`}
        className="inline-flex items-center gap-2 text-gray-600 mb-6"
      >
        <IconArrowLeft size={18} /> Back to trainings
      </Link>

      {!isEditable && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 rounded">
          {
            "You have already submitted your audition. You cannot re-submit unless marked as 'retry' by an admin."
          }
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            {isRetry ? "Resubmit Your Audition" : "Submit Your Application"}
          </h1>
          <Divider className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
            {!canEditInputs && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-40 rounded-lg z-10 flex items-center justify-center">
                <div className="bg-white p-3 rounded-full shadow-md">
                  <IconLock size={32} className="text-gray-500" />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="resumeInput"
                className={`block text-sm font-semibold mb-2 ${!canEditInputs ? "text-gray-400" : "text-gray-700"}`}
              >
                Resume/CV*
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resume"
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  disabled={!canEditInputs}
                  style={{
                    height: "46px",
                  }}
                />
                <label
                  htmlFor="resume"
                  className={`flex items-center justify-between w-full px-4 py-2 rounded-md cursor-pointer transition-colors ${!canEditInputs ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-tinteddark4 hover:bg-gray-50"}`}
                  style={{
                    border: "1px solid #E7E7E7",
                    height: "46px",
                  }}
                >
                  <span
                    className={`text-sm truncate ${!canEditInputs ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {resumeFile ? resumeFile.name : "Upload Resume"}
                  </span>

                  <Image src="/icons/upload.svg" width={20} height={20} alt="upload icon" />
                </label>
              </div>
              {resumeFile && (
                <p className="text-xs text-gray-500 mt-1">Selected: {resumeFile.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="experienceSelect"
                className={`block text-sm font-semibold mb-2 ${!canEditInputs ? "text-gray-400" : "text-gray-700"}`}
              >
                Years of sales experience*
              </label>
              <div className="relative">
                <select
                  id="experienceSelect"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required={canEditInputs}
                  disabled={!canEditInputs}
                  className={`w-full bg-white h-12 px-4 py-3 text-sm placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm transition-colors ${!canEditInputs ? "bg-gray-100 text-gray-400" : "text-gray-800"}`}
                  style={{
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <option value="" disabled>
                    Select experience
                  </option>
                  <option value="0-1">0-1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="countryInput"
                className={`block text-sm font-semibold mb-2 ${!canEditInputs ? "text-gray-400" : "text-gray-700"}`}
              >
                Country*
              </label>
              <div className="relative">
                <CustomTextInput
                  id="countryInput"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required={canEditInputs}
                  disabled={!canEditInputs}
                  placeholder="e.g., United States"
                  className={`h-[46px] ${!canEditInputs ? "bg-gray-100 text-gray-400" : ""}`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="linkedinInput"
                className={`block text-sm font-semibold mb-2 ${!canEditInputs ? "text-gray-400" : "text-gray-700"}`}
              >
                LinkedIn Profile URL*
              </label>
              <div className="relative">
                <CustomTextInput
                  id="linkedinInput"
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  required={canEditInputs}
                  disabled={!canEditInputs}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className={`h-[46px] ${!canEditInputs ? "bg-gray-100 text-gray-400" : ""}`}
                />
              </div>
            </div>
          </div>
          <div
            className="mb-8 p-4 rounded-lg"
            style={{
              backgroundColor: "#f0f3f4",
            }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Audio Audition Instructions
            </h2>
            <p className="text-sm text-gray-700 mb-1">
              Every great sales professional has a unique story. Introduce yourself and share your
              journey!
            </p>
            <p className="text-sm text-gray-600 mb-2">
              😄 <span className="font-medium">Example:</span>
              {`"Hi there! I'm Alex, from ZoomInfo..."`}
            </p>
          </div>

          {isRetry && feedbackNotes && (
            <Paper p="md" radius="md" withBorder className="mb-4 bg-yellow-50 border-yellow-300">
              <Text
                size="sm"
                className="mt-3 text-gray-700 bg-yellow-100 p-2 rounded border border-yellow-200"
              >
                <strong>Note:</strong> You only need to resubmit the audio responses that require
                changes. Your profile information (resume, experience, country, and LinkedIn) will
                remain unchanged.
              </Text>
              <div className=" bg-yellow-100 p-2 rounded border border-yellow-200">
                <Text fw={600} size="md" className="mb-1 text-darker mt-4">
                  {"Admin's Feedback"}
                </Text>
                <Text size="sm" className="text-darker">
                  {feedbackNotes}
                </Text>
              </div>
            </Paper>
          )}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Audition Questions</h2>
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={q._id} className="mb-6">
                <p className="mb-2 font-medium text-gray-700">
                  {index + 1}. {q.question}
                </p>
                <AudioRecorderForQuestion
                  questionId={q._id}
                  onAudioRecorded={handleAudioRecorded}
                  initialAudioBlob={
                    audioResponses[q._id] instanceof Blob ? audioResponses[q._id] : null
                  }
                  isLocked={!isEditable}
                  previousAudioUrl={getPreviousAudioUrl(audioResponses[q._id])}
                />

                {audioResponses[q._id] && (
                  <div className="mt-2 text-xs text-green-600 flex items-center">
                    <IconCheck size={16} className="mr-1" /> Answer provided.
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No audition questions available for this campaign.</p>
          )}

          <div className="mt-10 text-center">
            <Button
              type="submit"
              disabled={
                !isEditable || isSubmitting || questions.some((q) => !audioResponses[q._id])
              }
              className="w-full md:w-auto rounded-md"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
              {!isSubmitting && <IconArrowRight size={18} className="inline ml-2" />}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
