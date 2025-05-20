"use client";
import { useState, useEffect, useRef } from "react";
import {
  IconMicrophone,
  IconPlayerStop,
  IconPlayerPlay,
  IconTrash,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mantine/core";

interface AudioRecorderProps {
  questionId: string;
  onAudioRecorded: (questionId: string, blob: Blob | null) => void;
  initialAudioBlob: Blob | null;
}

const AudioRecorderForQuestion: React.FC<AudioRecorderProps> = ({
  questionId,
  onAudioRecorded,
  initialAudioBlob,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(initialAudioBlob);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialAudioBlob) {
      const url = URL.createObjectURL(initialAudioBlob);
      setAudioURL(url);
      setStatusMessage("Recording available.");
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioURL(null);
      setStatusMessage("");
    }
  }, [initialAudioBlob]);

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setStatusMessage("Initializing...");
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    setRecordedAudioBlob(null);
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
        console.warn("Preferred MIME types not supported, trying default.");
        try {
          const testRecorder = new MediaRecorder(streamRef.current);
          selectedMimeType = testRecorder.mimeType || "audio/webm";
        } catch (e) {
          setErrorMessage("No suitable audio recording format found.");
          setStatusMessage("");
          cleanupStream();
          return;
        }
      }
      console.log("Using MIME type:", selectedMimeType);

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
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        onAudioRecorded(questionId, blob);
        setIsRecording(false);
        setStatusMessage("Recording complete. Preview available.");
        cleanupStream();
      };

      mediaRecorderRef.current.onerror = (event: any) => {
        console.error("MediaRecorder error:", event.error || event);
        setErrorMessage(`Recording error: ${event.error?.name || "Unknown error"}`);
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
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setRecordedAudioBlob(null);
    setIsRecording(false);
    onAudioRecorded(questionId, null);
    setStatusMessage("Recording discarded. Ready to record again.");
    setErrorMessage(null);
    cleanupStream();
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      cleanupStream();
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);
  return (
    <div className="p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
      <div className="flex items-center space-x-3 mb-2">
        {!isRecording && !recordedAudioBlob && (
          <Button
            onClick={startRecording}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <IconMicrophone size={18} className="mr-2" />
            Record Answer
          </Button>
        )}
        {isRecording && (
          <Button
            onClick={stopRecording}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <IconPlayerStop size={18} className="mr-2" />
            Stop Recording
          </Button>
        )}
      </div>

      <AnimatePresence>
        {statusMessage && !errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`text-xs mt-1 ${isRecording ? "text-red-500 animate-pulse" : "text-gray-600"}`}
          >
            {statusMessage}
          </motion.p>
        )}
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-600 mt-1 flex items-center"
          >
            <IconAlertCircle size={14} className="mr-1" /> {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {audioURL && recordedAudioBlob && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3"
        >
          <p className="text-xs font-medium text-gray-700 mb-1">Preview:</p>
          <audio controls src={audioURL} className="w-full h-10 rounded-md shadow-sm"></audio>
          <Button
            onClick={handleDiscard}
            className="flex items-center justify-center mt-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 hover:text-darker focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            <IconTrash size={14} className="mr-1" />
            Discard & Re-record
          </Button>
        </motion.div>
      )}
      {!isRecording && recordedAudioBlob && !audioURL && (
        <div className="mt-2 text-xs text-green-600 flex items-center">
          <IconCheck size={16} className="mr-1" /> Answer recorded.
        </div>
      )}
    </div>
  );
};

export default AudioRecorderForQuestion;
