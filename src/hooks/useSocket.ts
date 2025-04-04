import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Session } from '../types/call';

interface ServerToClientEvents {
  'call-session-update': (session: Session) => void;
  'call-session-complete': (session: Session) => void;
  'call-status-update': (update: string) => void;
}
interface ClientToServerEvents {
  'call-session-initiate': (to: string) => void;
  'call-session-accept': (sessionId: string) => void;
  'call-session-reject': (sessionId: string) => void;
  'call-session-end': (sessionId: string) => void;
  'call-status-update': (update: string) => void;
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('API URL not configured');
      return;
    }

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL);
    setSocket(newSocket as Socket<ServerToClientEvents, ClientToServerEvents>);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket };
};