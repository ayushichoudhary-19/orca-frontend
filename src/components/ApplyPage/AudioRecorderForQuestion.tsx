"use client";
import { useState, useEffect, useRef } from "react";
import {
  IconMicrophone,
  IconPlayerStop,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Text } from "@mantine/core";

interface AudioRecorderProps {
  questionId: string;
  onAudioRecorded: (questionId: string, blob: Blob | null) => void;
  initialAudioBlob: Blob | null;
  isLocked?: boolean;
  previousAudioUrl?: string;
}

const AudioRecorderForQuestion: React.FC<AudioRecorderProps> = ({
  questionId,
  onAudioRecorded,
  initialAudioBlob,
  isLocked,
  previousAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [previewAudioURL, setPreviewAudioURL] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialAudioBlob) {
      setCurrentAudioBlob(initialAudioBlob);
      const url = URL.createObjectURL(initialAudioBlob);
      setPreviewAudioURL(url);
      setStatusMessage("Previously recorded audio available.");
    } else {
      setCurrentAudioBlob(null);
      setPreviewAudioURL(null);
      setStatusMessage("");
    }

    return () => {
      if (previewAudioURL && initialAudioBlob) {
        URL.revokeObjectURL(previewAudioURL);
      }
    };
  }, [initialAudioBlob, questionId]);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const revokeCurrentPreviewURL = () => {
    if (previewAudioURL) {
      URL.revokeObjectURL(previewAudioURL);
      setPreviewAudioURL(null);
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setStatusMessage("Initializing...");
    revokeCurrentPreviewURL();
    setCurrentAudioBlob(null);
    onAudioRecorded(questionId, null);

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "audio/aac",
        "audio/wav",
      ];
      let selectedMimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
      if (!selectedMimeType) {
        const fallback = new MediaRecorder(streamRef.current);
        selectedMimeType = fallback.mimeType || "audio/webm";
      }

      mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
        mimeType: selectedMimeType,
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: selectedMimeType });
        setCurrentAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewAudioURL(url);
        onAudioRecorded(questionId, blob);
        setIsRecording(false);
        setStatusMessage("Recording complete. Preview available.");
        cleanupStream();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatusMessage("Recording...");
    } catch (err: any) {
      setErrorMessage("Could not start recording: " + err.message);
      setStatusMessage("");
      cleanupStream();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDiscard = () => {
    revokeCurrentPreviewURL();
    setCurrentAudioBlob(null);
    setIsRecording(false);
    onAudioRecorded(questionId, null);
    setStatusMessage("Recording discarded. Ready to record again.");
    setErrorMessage(null);
    cleanupStream();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      cleanupStream();
      revokeCurrentPreviewURL();
    };
  }, []);

  const showPreviousSubmission =
    previousAudioUrl && !previewAudioURL && !currentAudioBlob;

  return (
    <div className="p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex items-center space-x-3 mb-2">
        {!isLocked && !isRecording && !currentAudioBlob && (
          <Button
            onClick={startRecording}
            leftSection={<IconMicrophone size={18} />}
            variant="filled"
            color="red"
          >
            Record Answer
          </Button>
        )}
        {!isLocked && isRecording && (
          <Button
            onClick={stopRecording}
            leftSection={<IconPlayerStop size={18} />}
            variant="filled"
            color="blue"
          >
            Stop Recording
          </Button>
        )}
      </div>

      <AnimatePresence>
        {statusMessage && !errorMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Text
              size="xs"
              mt="xs"
              className={
                isRecording
                  ? "text-red-500 animate-pulse dark:text-red-400"
                  : "text-gray-600 dark:text-gray-300"
              }
            >
              {statusMessage}
            </Text>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Text size="xs" c="red" mt="xs" className="flex items-center">
              <IconAlertCircle size={14} className="mr-1" /> {errorMessage}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>

      {previewAudioURL && currentAudioBlob && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3"
        >
          <Text size="xs" fw={500} mb="xs" className="text-gray-700 dark:text-gray-200">
            Preview:
          </Text>
          <audio controls src={previewAudioURL} className="w-full h-10 rounded-md shadow-sm" />
          {!isLocked && !isRecording && (
            <Button
              onClick={handleDiscard}
              leftSection={<IconTrash size={14} />}
              variant="light"
              color="red"
              size="xs"
              mt="sm"
            >
              Discard & Re-record
            </Button>
          )}
        </motion.div>
      )}

      {showPreviousSubmission && (
        <div className="mt-3">
          <Text size="xs" fw={500} mb="xs" className="text-gray-700 dark:text-gray-200">
            Previous Submission:
          </Text>
          <audio
            controls
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/stream/${previousAudioUrl}`}
            className="w-full h-10 rounded-md shadow-sm"
          />
        </div>
      )}

      {isLocked && (
        <Text size="xs" c="dimmed" className="mt-1">
          Locked for editing. You can only record if the admin asks for a retry.
        </Text>
      )}
    </div>
  );
};

export default AudioRecorderForQuestion;
