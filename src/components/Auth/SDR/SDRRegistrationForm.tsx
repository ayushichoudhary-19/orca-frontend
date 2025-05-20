"use client";

import type React from "react";

import { useState } from "react";
import { Button, Stack, Title, Chip, Group, Text, Select } from "@mantine/core";
import { ErrorAlert } from "@/components/Utils/ErrorAlert";
import { motion } from "framer-motion";
import ISO6391 from "iso-639-1";
import {
  IconArrowRight,
  IconArrowNarrowLeft,
  IconEye,
  IconEyeOff,
  IconX,
  IconSquareRoundedPlus,
} from "@tabler/icons-react";
import { getErrorMessage } from "@/utils/errorUtils";
import Link from "next/link";
import CustomTextInput from "@/components/Utils/CustomTextInput";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Language = {
  language: string;
  proficiency: string;
};

type SDRRegistrationFormProps = {
  onSubmit: (userData: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    resume: File | null;
    languages: Language[];
  }) => Promise<void>;
  onBack?: () => void;
};

export const PROFICIENCY_LEVELS = [
  { value: "Basic", label: "Basic" },
  { value: "Conversational", label: "Conversational" },
  { value: "Professional", label: "Professional" },
  { value: "Fluent", label: "Fluent" },
  { value: "Native", label: "Native" },
];

export const LANGUAGES = ISO6391.getAllNames().map((name) => ({
  value: name,
  label: name,
}));

export const SDRRegistrationForm = ({ onSubmit, onBack }: SDRRegistrationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [newProficiency, setNewProficiency] = useState("");
  const [showLanguageInput, setShowLanguageInput] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      await onSubmit({
        fullName,
        email,
        password,
        phoneNumber,
        resume,
        languages,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = "/";
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const addLanguage = () => {
    if (newLanguage && newProficiency) {
      setLanguages([...languages, { language: newLanguage, proficiency: newProficiency }]);
      setNewLanguage("");
      setNewProficiency("");
      setShowLanguageInput(false);
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-top relative"
      style={{
        backgroundColor: "#6D57FC",
        backgroundImage: "url('/bg-auth-1.png')",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 shadow-md w-full max-w-3xl mx-auto text-left relative z-1"
      >
        <div className="text-center mb-6">
          <Title c="#6D57FC" fw={800} size="38px">
            ORCA
          </Title>
        </div>

        <Button
          variant="subtle"
          onClick={handleBack}
          className="p-0 mb-4 bg-white hover:bg-gray-100 transition-colors rounded-full"
        >
          <IconArrowNarrowLeft size={30} color="#0C0A1C" stroke={1} />
        </Button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Text className="mb-2 text-[36px]" fw={400}>
            Welcome to <span className="text-primary font-semibold">ORCA</span>
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack>
              <ErrorAlert message={error} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-darker mb-1">Full Name</label>
                  <CustomTextInput
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name here"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-darker mb-1">Email</label>
                  <CustomTextInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Business@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-darker mb-1">Password</label>
                  <div className="relative">
                    <CustomTextInput
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Input your password"
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute top-0 right-0 h-full w-10 flex items-center justify-center bg-white rounded-r-md border border-softgray border-solid rounded-md border-l-0 rounded-tl-none rounded-bl-none hover:cursor-pointer appearance-none shadow-none"
                    >
                      {passwordVisible ? (
                        <IconEyeOff size={25} color="#292D32" />
                      ) : (
                        <IconEye size={25} color="#292D32" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-darker mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <CustomTextInput
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Input your confirm password"
                      required
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute top-0 right-0 h-full w-10 flex items-center justify-center bg-white rounded-r-md border border-softgray border-solid rounded-md border-l-0 rounded-tl-none rounded-bl-none hover:cursor-pointer appearance-none shadow-none"
                    >
                      {confirmPasswordVisible ? (
                        <IconEyeOff size={25} color="#292D32" />
                      ) : (
                        <IconEye size={25} color="#292D32" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-darker mb-1">Resume</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="resume"
                      onChange={handleResumeUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="resume"
                      className="flex items-center text-tinteddark4 justify-between w-full px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        border: "1px solid #E7E7E7",
                        height: "55px",
                      }}
                    >
                      <span className="text-gray-500 truncate">
                        {resume ? resume.name : "Upload Resume"}
                      </span>
                      <Image src="/icons/upload.svg" width={20} height={20} alt="upload icon" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-darker mb-1">
                    Phone Number
                  </label>
                  <CustomTextInput
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Add Phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-darker mb-1">Language</label>
                <div
                  className="rounded-md p-2 min-h-[50px] min-w-full"
                  style={{
                    border: "1px solid #E7E7E7",
                  }}
                >
                  <Group gap="xs">
                    {languages.map((lang, index) => (
                      <Chip
                        key={index}
                        checked={false}
                        variant="filled"
                        size="sm"
                        className="text-[#6D57FC] rounded-md px-2 py-1 mr-1 mb-1 inline-flex items-center"
                      >
                        <span className="mr-1">
                          {lang.language} - {lang.proficiency}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="rounded-full items-center justify-center text-[#292D32] hover:cursor-pointer bg-transparent border-none transition-colors"
                        >
                          <IconX size={14} />
                        </button>
                      </Chip>
                    ))}

                    {!showLanguageInput && (
                      <button type="button" className="p-1 rounded-full bg-transparent border-0">
                        <IconSquareRoundedPlus
                          onClick={() => setShowLanguageInput(true)}
                          size={22}
                          stroke={1.5}
                          color="#292D32"
                        />
                      </button>
                    )}
                  </Group>

                  {showLanguageInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 grid grid-cols-2 gap-2"
                    >
                      <Select
                        value={newLanguage}
                        onChange={(value) => setNewLanguage(value || "")}
                        placeholder="Select language"
                        data={LANGUAGES}
                        searchable
                        styles={{
                          input: {
                            height: "50px",
                            border: "1px solid #E7E7E7",
                            borderRadius: "6px",
                          },
                        }}
                      />
                      <Select
                        value={newProficiency}
                        onChange={(value) => setNewProficiency(value || "")}
                        placeholder="Select proficiency"
                        data={PROFICIENCY_LEVELS}
                        searchable
                        styles={{
                          input: {
                            height: "50px",
                            border: "1px solid #E7E7E7",
                            borderRadius: "6px",
                          },
                        }}
                      />
                      <Button
                        onClick={addLanguage}
                        className="bg-[#6D57FC] hover:bg-[#5A48D3] text-white rounded-lg"
                        disabled={!newLanguage || !newProficiency}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowLanguageInput(false)}
                        className="border-[#6D57FC] text-[#6D57FC] rounded-lg"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                className="bg-[#6D57FC] rounded-lg text-base hover:bg-[#5A48D3] transition-colors mt-4"
                rightSection={<IconArrowRight size={18} />}
                onClick={handleSubmit}
              >
                Signup
              </Button>

              <div className="text-center mt-2">
                Already have an account?{" "}
                <Link href="/signin" className="text-[#6D57FC] hover:underline">
                  Sign in
                </Link>
              </div>
            </Stack>
          </form>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-8 text-center text-xs text-white">
        @2025 ORCA All Right Reserved.
      </div>
    </div>
  );
};
