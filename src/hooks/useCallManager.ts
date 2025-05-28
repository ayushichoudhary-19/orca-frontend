import { useState, useEffect, useRef } from "react";
import { Device, Call, TwilioError } from "@twilio/voice-sdk";
import { axiosClient } from "@/lib/axiosClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { usePathname } from "next/navigation";
import { toast } from "@/lib/toast";

interface CallState {
  id: string;
  to: string;
  from: string;
  status: "idle" | "calling" | "ringing" | "connected" | "ended";
  startTime: Date | null;
  duration: number;
  connection?: Call;
  muted: boolean;
  speaker: boolean;
}

export const useCallManager = () => {
  const [call, setCall] = useState<CallState>({
    id: "",
    to: "",
    from: "",
    status: "idle",
    startTime: null,
    duration: 0,
    muted: false,
    speaker: false,
  });
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const salesRepId = useSelector((state: RootState) => state.auth.user?.uid);
  const campaignId = usePathname().split("/")[2];

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;
  const initializedRef = useRef(false);

  useEffect(() => {
    const initDevice = async () => {
      if (initializedRef.current || device) {
        console.log("Device initialization already attempted or completed.");
        return;
      }
      initializedRef.current = true;
      console.log("Attempting to initialize Twilio Device...");

      try {
        const { data } = await axiosClient.get(`${API_BASE_URL}/twilio/token`);
        if (!data.token) {
          console.error("❌ Twilio token fetch failed: No token in response");
          toast.error("Failed to get audio token. Please refresh.");
          initializedRef.current = false;
          return;
        }
        const newDevice = new Device(data.token);

        newDevice.on("registered", () => {
          console.log("✅ Twilio Device registered successfully.");
          setDevice(newDevice);
        });

        newDevice.on("unregistered", () => {
          console.log("🔔 Twilio Device unregistered.");
        });

        newDevice.on("error", (twilioError: Error) => {
          console.error("❌ Twilio Device Error:", twilioError.message);
          toast.error(`Audio system error: ${twilioError.message}`);
          setDevice(null);
          initializedRef.current = false;
        });

        await newDevice.register();
        console.log("Twilio Device registration process initiated.");
      } catch (err: any) {
        console.error("❌ Twilio Device initialization failed (token fetch or setup):", err);
        toast.error(
          err.response?.data?.message || "Failed to initialize audio system. Please check console."
        );
        initializedRef.current = false;
      }
    };

    const handleInteractionOnce = () => {
      console.log("User interaction detected. Calling initDevice.");
      if (!initializedRef.current && !device) {
        initDevice();
      }
      document.removeEventListener("click", handleInteractionOnce);
      document.removeEventListener("touchstart", handleInteractionOnce);
    };

    if (!device && !initializedRef.current) {
      console.log("Setting up interaction listeners for device initialization.");
      document.addEventListener("click", handleInteractionOnce, { once: true });
      document.addEventListener("touchstart", handleInteractionOnce, { once: true });
    }

    return () => {
      document.removeEventListener("click", handleInteractionOnce);
      document.removeEventListener("touchstart", handleInteractionOnce);
    };
  }, [API_BASE_URL, device]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (call.status === "connected" && call.startTime) {
      interval = setInterval(() => {
        setCall((prev) => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [call.status, call.startTime]);

  const startCall = async (to: string) => {
    console.log("Trying to start call to:", to);
    if (!device) {
      toast.error("Audio system not ready. Please wait for initialization to complete.");
      console.warn("❌ Device is not initialized. Cannot start call.");
      return;
    }
    if (!to || typeof to !== "string" || to.trim() === "") {
      toast.error("Invalid phone number for the call.");
      console.error("❌ Invalid or missing 'to' number provided:", to);
      return;
    }

    try {
      setIsLoading(true);
      setCall((prev) => ({
        ...prev,
        to,
        status: "calling",
        startTime: new Date(),
        duration: 0,
        connection: undefined,
        id: "",
      }));

      console.log(`📞 Initiating Twilio call to ${to}`);
      const connection: Call = await device.connect({ params: { To: to } });
      console.log("📞 Twilio call initiated. Connection object:", connection);

      setCall((prev) => ({ ...prev, connection }));

      connection.on("accept", (activeCall: Call) => {
        const callSid = activeCall.parameters.CallSid;
        const fromNumber =
          activeCall.parameters.From || process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER || "Unknown";

        console.log(`Call ${callSid} accepted by remote. From: ${fromNumber}, To: ${to}`);
        setCall((prev) => ({
          ...prev,
          id: callSid,
          from: fromNumber,
          status: "connected",
          startTime: new Date(),
          duration: 0,
          connection: activeCall,
        }));

        if (salesRepId && campaignId && callSid) {
          axiosClient
            .post(`${API_BASE_URL}/calls/call`, {
              id: callSid,
              to,
              from: fromNumber,
              campaignId,
              salesRepId,
            })
            .then(() => {
              console.log(`Call ${callSid} logged to backend.`);
            })
            .catch((error) => {
              console.error("Failed to save call:", error);
              toast.error("Error logging call details.");
            });
        } else {
          console.warn("Missing salesRepId, campaignId, or callSid. Cannot log call to backend.");
        }
      });

      connection.on("disconnect", () => {
        console.log(`Call ${call.id || connection.parameters.CallSid} disconnected.`);
        setCall((prev) => ({
          ...prev,
          status: "ended",
          connection: undefined,
        }));
      });

      connection.on("error", (error: Error) => {
        console.error(
          `Twilio call error for ${call.id || connection.parameters.CallSid}:`,
          error.message
        );
        toast.error(`Call error: ${error.message}`);
        setCall((prev) => ({
          ...prev,
          status: "ended",
          connection: undefined,
        }));
      });

      connection.on("ringing", (hasEarlyMedia: boolean) => {
        console.log(`Call is ringing. Early media: ${hasEarlyMedia}`);
        setCall((prev) => ({ ...prev, status: "ringing" }));
      });
    } catch (error: any) {
      console.error("Call failed to initiate:", error);
      toast.error(error.message || "Could not start the call. Please try again.");
      setCall((prev) => ({
        ...prev,
        status: "ended",
        connection: undefined,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = async () => {
    if (!call.connection) {
      console.log("No active call connection to end.");
      if (device && (call.status === "calling" || call.status === "ringing")) {
        console.log("Disconnecting pending outgoing call from device.");
        device.disconnectAll();
      }
      setCall((prev) => ({ ...prev, status: "ended" }));
      return;
    }

    try {
      console.log(`Ending call: ${call.id}`);
      call.connection.disconnect();
      setCall((prev) => ({
        ...prev,
      }));

      if (call.id) {
        await axiosClient.post(`${API_BASE_URL}/calls/end`, { callId: call.id });
        console.log(`Call ${call.id} end logged to backend.`);
      }
    } catch (error) {
      console.error("Failed to properly end or log call end:", error);
      setCall((prev) => ({ ...prev, status: "ended", connection: undefined }));
    }
  };

  const toggleMute = (muted: boolean) => {
    if (call.connection) {
      call.connection.mute(muted);
      setCall((prev) => ({ ...prev, muted }));
    }
  };

  const toggleSpeaker = (speaker: boolean) => {
    setCall((prev) => ({ ...prev, speaker }));
  };

  const isDeviceReady = !!device;

  return {
    call,
    isLoading,
    startCall,
    endCall,
    toggleMute,
    toggleSpeaker,
    isDeviceReady,
    device,
  };
};
