"use client";
import { useState, useEffect, useRef } from "react";
import {
  IconMicrophone,
  IconPlayerStop,
  IconTrash,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Text } from "@mantine/core";

interface AudioRecorderProps {
  questionId: string;
  onAudioRecorded: (questionId: string, blob: Blob | null) => void;
  /**
   * Represents a pre-existing audio recording.
   * If provided, the component initializes with this audio.
   * This should be a Blob object. If loading from an S3 key,
   * the parent component is responsible for fetching the audio data
   * and converting it into a Blob before passing it here.
   */
  initialAudioBlob: Blob | null;
}

const AudioRecorderForQuestion: React.FC<AudioRecorderProps> = ({
  questionId,
  onAudioRecorded,
  initialAudioBlob,
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
      // Call onAudioRecorded so parent knows about this initial blob if it needs to
      // This might be redundant if parent is already aware, consider if needed for your logic
      // onAudioRecorded(questionId, initialAudioBlob);
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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Audio recording is not supported by your browser.");
        setStatusMessage("");
        return;
      }
      if (!window.MediaRecorder) {
        setErrorMessage("MediaRecorder API not supported. Cannot record audio.");
        setStatusMessage("");
        return;
      }

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
        console.warn("Preferred MIME types not supported, trying default. Fallback to audio/webm.");
        try {
          const testRecorder = new MediaRecorder(streamRef.current);
          selectedMimeType = testRecorder.mimeType || "audio/webm";
        } catch (e) {
          setErrorMessage("No suitable audio recording format found after fallback.");
          setStatusMessage("");
          cleanupStream();
          return;
        }
      }
      console.log("Using MIME type for recording:", selectedMimeType);

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

      mediaRecorderRef.current.onerror = (event: Event) => {
        const mediaRecorderError = (event as any).error || new Error("Unknown MediaRecorder error");
        console.error("MediaRecorder error:", mediaRecorderError);
        setErrorMessage(`Recording error: ${mediaRecorderError.name || "Unknown error"}`);
        setIsRecording(false);
        setStatusMessage("Recording failed.");
        cleanupStream();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatusMessage("Recording...");
    } catch (err: any) {
      console.error("Error starting recording:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Microphone access denied. Please enable it in your browser settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No microphone found. Please connect a microphone.");
      } else {
        setErrorMessage(`Could not start recording: ${err.message}`);
      }
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      cleanupStream();
      revokeCurrentPreviewURL();
    };
  }, []);

  return (
    <div className="p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="flex items-center space-x-3 mb-2">
        {!isRecording && !currentAudioBlob && (
          <Button
            onClick={startRecording}
            leftSection={<IconMicrophone size={18} />}
            variant="filled"
            color="red"
          >
            Record Answer
          </Button>
        )}
        {isRecording && (
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Text size="xs" mt="xs" className={isRecording ? "text-red-500 animate-pulse dark:text-red-400" : "text-gray-600 dark:text-gray-300"}>
              {statusMessage}
            </Text>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Text size="xs" color="red" mt="xs" className="flex items-center">
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
          <Text size="xs" fw={500} mb="xs" className="text-gray-700 dark:text-gray-200">Preview:</Text>
          <audio controls src={previewAudioURL} className="w-full h-10 rounded-md shadow-sm"></audio>
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
        </motion.div>
      )}
      {!isRecording && currentAudioBlob && !previewAudioURL && (
        <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
          <IconCheck size={16} className="mr-1" /> Audio processed.
        </div>
      )}
    </div>
  );
};

export default AudioRecorderForQuestion;