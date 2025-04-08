// hooks/useCallManager.ts
import { useState, useEffect } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import axios from 'axios';

interface CallState {
  id: string;
  to: string;
  from: string;
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
  startTime: Date | null;
  duration: number;
  connection?: Call;
  muted: boolean;
  speaker: boolean;
}

export const useCallManager = () => {
  const [call, setCall] = useState<CallState>({
    id: '',
    to: '',
    from: '',
    status: 'idle',
    startTime: null,
    duration: 0,
    muted: false,
    speaker: false
  });
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:8080/api'
  // Initialize Twilio device
  useEffect(() => {
    const initDevice = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/twilio/token`);
        const device = new Device(data.token);
        
        device.on('ready', () => console.log('Device ready'));
        device.on('error', (error) => console.error('Device error:', error));
        
        device.on('incoming', (conn) => {
          setCall(prev => ({
            ...prev,
            id: conn.parameters.CallSid,
            from: conn.parameters.From,
            to: conn.parameters.To,
            status: 'ringing',
            connection: conn
          }));
        });

        setDevice(device);
      } catch (error) {
        console.error('Failed to initialize device:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDevice();
    return () => device?.destroy();
  }, [device]);

  // Update call duration
  useEffect(() => {
    let internval: NodeJS.Timeout;
    
    if (call.status === 'connected' && call.startTime) {
      internval = setInterval(() => {
        setCall(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000)
        }));
      }, 1000);
    }

    return () => clearInterval(internval);
  }, [call.status, call.startTime]);

  const startCall = async (to: string) => {
    if (!device || !to) return;

    try {
      setIsLoading(true);
      setCall(prev => ({
        ...prev,
        to,
        status: 'calling'
      }));
  
      const connection = await device.connect({ params: { To: to } });
      
      connection.on('accept', async () => {
        const callSid = connection.parameters.CallSid;
        const from = process.env.TWILIO_PHONE_NUMBER;
        setCall(prev => ({
          ...prev,
          id: callSid,
          status: 'connected',
          startTime: new Date(),
          duration: 0,
          connection
        }));
      
        // ✅ Save the call record to backend using Twilio SID
        try {
          await axios.post(`${API_BASE_URL}/calls/call`, {
            id: callSid,
            to,
            from,
          });
        } catch (error) {
          console.error('Failed to save call:', error);
        }
      });
      

      connection.on('disconnect', () => {
        setCall(prev => ({
          ...prev,
          status: 'ended'
        }));
      });
    } catch (error) {
      console.error('Call failed:', error);
      setCall(prev => ({
        ...prev,
        status: 'ended'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = async () => {
    if (!call.connection) return;
    
    try {
      call.connection.disconnect();
      setCall(prev => ({
        ...prev,
        status: 'ended'
      }));
      
      if (call.id) { // Add this check
        await axios.post(`${API_BASE_URL}/calls/end`, { callId: call.id });
      }
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const toggleMute = (muted: boolean) => {
    if (call.connection) {
      call.connection.mute(muted);
      setCall(prev => ({ ...prev, muted }));
    }
  };

  const toggleSpeaker = (speaker: boolean) => {
    // This requires additional audio routing setup
    setCall(prev => ({ ...prev, speaker }));
  };

  return {
    call,
    isLoading,
    startCall,
    endCall,
    toggleMute,
    toggleSpeaker
  };
};