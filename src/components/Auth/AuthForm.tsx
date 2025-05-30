"use client";

import { useState } from "react";
import { Button, Stack, Title } from "@mantine/core";
import { ErrorAlert } from "@/components/Utils/ErrorAlert";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight, IconArrowNarrowLeft, IconEye, IconEyeOff } from "@tabler/icons-react";
import { AuthHeader } from "../Auth/AuthHeader";
import { getErrorMessage } from "@/utils/errorUtils";
import Link from "next/link";
import CustomTextInput from "../Utils/CustomTextInput";
import { useRouter } from "next/navigation";

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleAuth?: () => Promise<void>;
};

export const AuthForm = ({ onSubmit, onGoogleAuth }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await onSubmit(email, password);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setStep(2);
    }
  };

  const goBack = () => {
    if (step === 1) {
      window.location.href = "/";
    } else {
      setStep(1);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-top relative"
      style={{
        backgroundColor: step === 1 ? "white" : "#6D57FC",
        backgroundImage:
          step === 1 ? `url('/bg-auth-base.png'), url('/bg-auth-0.png')` : `url('/bg-auth-1.png')`,
        backgroundSize: step === 1 ? "contain, contain" : "cover",
        backgroundRepeat: step === 1 ? "no-repeat, no-repeat" : "repeat",
        backgroundBlendMode: "normal",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          boxShadow: "0 5px 10px rgba(76, 57, 47, 0.1)",
          width: "30rem",
          maxWidth: "100%",
          margin: "0 auto",
          textAlign: "left",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="text-center mb-6">
          <Title c="#6D57FC" fw={800} size="38px">
            ORCA
          </Title>
        </div>

        <Button
          variant="subtle"
          onClick={goBack}
          className="p-0 mb-2 bg-white hover:bg-gray-100 transition-colors rounded-full"
        >
          <IconArrowNarrowLeft size={30} color="#0C0A1C" stroke={1} />
        </Button>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AuthHeader />
              <form onSubmit={handleContinue}>
                <Stack>
                  <ErrorAlert message={error} />
                  <Button
                    variant="unstyled"
                    fullWidth
                    size="md"
                    className="bg-white h-[60px] py-3 text-primary hover:bg-darker transition-colors border border-softgray font-bold"
                    rightSection={<IconArrowRight size={18} />}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        if (onGoogleAuth) {
                          setError("");
                          await onGoogleAuth();
                        }
                      } catch (err: unknown) {
                        setError(getErrorMessage(err));
                      }
                    }}
                  >
                    Login with Google
                  </Button>

                  <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />

                  {email.trim() !== "" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        className="bg-primary rounded-lg text-base hover:bg-darker transition-colors"
                        rightSection={<IconArrowRight size={18} />}
                      >
                        Continue
                      </Button>
                    </motion.div>
                  )}
                </Stack>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AuthHeader />
              <form onSubmit={handleSubmit}>
                <Stack>
                  <ErrorAlert message={error} />

                  <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />

                  <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                  <div className="text-right text-tinteddark5 text-sm">
                    Don’t remember your password?
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary no-underline hover:underline"
                    >
                      {" "}
                      Click here.
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    className="bg-primary rounded-lg text-base hover:bg-darker transition-colors"
                    size="lg"
                    rightSection={<IconArrowRight size={18} />}
                  >
                    Sign In
                  </Button>
                </Stack>
              </form>
            </motion.div>
          )}

          <span className="text-xs">
            Not a member?{" "}
            <Link href="/sales-rep-auth" className="underline hover:opacity-90 text-primary">
              Sign up as a Sales Rep
            </Link>
          </span>
        </AnimatePresence>
      </motion.div>

      <div
        className={`absolute bottom-8 text-center text-xs ${step === 1 ? "text-black" : "text-white"}`}
      >
        @2025 ORCA All Right Reserved.
        <br />
      </div>
    </div>
  );
};

const EmailInput = ({
  value,
  onChange,
  label = "Email",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: string;
}) => (
  <div className="mt-4">
    <label className="block text-sm font-semibold text-darker mb-1">{label}</label>
    <CustomTextInput
      type="email"
      value={value}
      onChange={onChange}
      placeholder="your.email@example.com"
    />
  </div>
);

const PasswordInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-darker mb-1">Password</label>
      <div className="relative">
        <CustomTextInput
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Input your password"
          required
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute top-0 right-0 h-full w-10 flex items-center justify-center bg-white rounded-r-md border border-l-0 hover:cursor-pointer"
          style={{
            border: "1px solid #e7e7e7",
            borderLeft: "0px"
          }}
  >
          {visible ? (
            <IconEyeOff size={25} color="#292D32" />
          ) : (
            <IconEye size={25} color="#292D32" />
          )}
        </button>
      </div>
    </div>
  );
};
