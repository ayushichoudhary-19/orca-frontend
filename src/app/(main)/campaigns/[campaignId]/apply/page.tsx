"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { axiosClient } from "@/lib/axiosClient";
import { Button, Divider } from "@mantine/core";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import AudioRecorderForQuestion from "@/components/ApplyPage/AudioRecorderForQuestion";
import { toast } from "@/lib/toast";
import Image from "next/image";

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

  const campaignId = usePathname().split("/")[2];

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const questionRes = await axiosClient.get(`/api/auditions/${campaignId}/questions`);
        setQuestions(questionRes.data || []);
        const initialAudioResponses: Record<string, Blob | null> = {};
        (questionRes.data || []).forEach((q: any) => {
          initialAudioResponses[q._id] = null;
        });
        setAudioResponses(initialAudioResponses);
      } catch (err) {
        console.error("Failed to fetch campaign/question details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchDetails();
    } else {
      setIsLoading(false);
      console.warn("Campaign ID is missing from the path.");
    }
  }, [campaignId]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      const tempUrl = URL.createObjectURL(file);
      setResumeUrl(tempUrl);
      console.log("Resume selected, temporary URL:", tempUrl);
    }
  };

  const handleAudioRecorded = (questionId: string, blob: Blob | null) => {
    setAudioResponses((prev) => ({ ...prev, [questionId]: blob }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allQuestionsAnswered = questions.every((q) => !!audioResponses[q._id]);

    if (!experience || !country || !linkedin || !allQuestionsAnswered) {
      toast.error("Please complete all fields and record all audio answers.");
      return;
    }

    try {
      setIsSubmitting(true);
      const uploadedAudioUrls: { questionId: string; audioUrl: string }[] = [];
      for (const q of questions) {
        const blob = audioResponses[q._id];
        if (blob) {
          const tempAudioUrl = URL.createObjectURL(blob);
          uploadedAudioUrls.push({ questionId: q._id, audioUrl: tempAudioUrl });
          console.log(`Simulated upload for Q:${q._id}, temp URL: ${tempAudioUrl}`);
        }
      }
      const payload = {
        responses: uploadedAudioUrls,
        resumeUrl: resumeUrl,
        experienceYears: experience,
        country,
        linkedInUrl: linkedin,
      };
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed. Check console and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="flex justify-center items-center h-screen">Loading questions...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/campaigns/${campaignId}/training`}
        className="inline-flex items-center gap-2 text-gray-600 mb-6"
        style={{
          fontWeight: "500",
          color: "gray",
          textDecoration: "none",
          transition: "color 0.3s",
          cursor: "pointer",
        }}
      >
        <IconArrowLeft size={18} /> Back to trainings
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Submit Your Application
          </h1>
          <Divider className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="resumeInput"
                className="block text-sm font-semibold mb-2 text-gray-700"
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
                  style={{
                    height: "46px"
                  }}
                />
                <label
                  htmlFor="resume"
                  className="flex items-center text-tinteddark4 justify-between w-full px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{
                    border: "1px solid #E7E7E7",
                    height: "46px",
                  }}
                >
                <span className="text-gray-500 text-sm truncate">
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
                className="block text-sm font-semibold mb-2 text-gray-700"
              >
                Years of sales experience*
              </label>
              <select
                id="experienceSelect"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="w-full bg-white h-12 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none shadow-sm transition-colors"
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
            <div>
              <label
                htmlFor="countryInput"
                className="block text-sm font-semibold mb-2 text-gray-700"
              >
                Country*
              </label>
              <CustomTextInput
                id="countryInput"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                placeholder="e.g., United States"
                className="h-[46px]"
              />
            </div>
            <div>
              <label
                htmlFor="linkedinInput"
                className="block text-sm font-semibold mb-2 text-gray-700"
              >
                LinkedIn Profile URL*
              </label>
              <CustomTextInput
                id="linkedinInput"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                required
                placeholder="https://linkedin.com/in/yourprofile"
                className="h-[46px]"
              />
            </div>
          </div>

          <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Audio Audition Instructions
            </h2>
            <p className="text-sm text-gray-700 mb-1">
              Every great sales professional has a unique story. Introduce yourself and share your
              journey!
            </p>
            <p className="text-sm text-gray-600 mb-2">
              😄 <span className="font-medium">Example:</span> "Hi there! I'm Alex, from ZoomInfo. I
              boosted meetings by 30% with a new outreach strategy, even landing Cisco!"
            </p>
          </div>

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
                  initialAudioBlob={audioResponses[q._id] || null}
                />
                {/* Show checkmark if audio is recorded for this question */}
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
              disabled={isSubmitting || isLoading || questions.some((q) => !audioResponses[q._id])}
              className="w-full md:w-auto rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
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
