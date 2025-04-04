// hooks/useSessionManager.ts
import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import axios from 'axios';
import { Session } from '../types/call';

interface SessionManagerState {
  activeSession: Session | null;
  sessionHistory: Session[];
  isLoading: boolean;
  error: string | null;
}

export const useSessionManager = () => {
  const [state, setState] = useState<SessionManagerState>({
    activeSession: null,
    sessionHistory: [],
    isLoading: false,
    error: null
  });
  const { socket } = useSocket();

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const { data } = await axios.get<Session[]>('localhost:8080/api/calls/sessions');
        setState(prev => ({
          ...prev,
          sessionHistory: data,
          isLoading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load session history',
          isLoading: false
        }));
      }
    };

    fetchSessionHistory();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('call-session-update', (updatedSession: Session) => {
      setState(prev => ({
        ...prev,
        activeSession: updatedSession,
        sessionHistory: prev.sessionHistory.map(session =>
          session.id === updatedSession.id ? updatedSession : session
        )
      }));
    });

    socket.on('call-session-complete', (completedSession: Session) => {
      setState(prev => ({
        ...prev,
        activeSession: null,
        sessionHistory: [completedSession, ...prev.sessionHistory]
      }));
    });

    return () => {
      socket.off('call-session-update');
      socket.off('call-session-complete');
    };
  }, [socket]);

  const startNewSession = async (phoneNumbers: string[]) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { data } = await axios.post('localhost:8080/api/calls/sessions', { phoneNumbers });
      
      setState(prev => ({
        ...prev,
        activeSession: data,
        sessionHistory: [data, ...prev.sessionHistory],
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to start new session',
        isLoading: false
      }));
    }
  };

  const proceedToNextCall = async (feedback?: {
    rating: number;
    notes?: string;
    duration: number;
  }) => {
    if (!state.activeSession) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const currentCall = state.activeSession.calls.find(
        call => call.sequenceIndex === state.activeSession?.currentIndex
      );

      if (currentCall && feedback) {
        await axios.post('localhost:8080/api/calls/feedback', {
          callId: currentCall.id,
          ...feedback
        });
      }

      const { data } = await axios.post('localhost:8080/api/calls/sessions/next', {
        sessionId: state.activeSession.id,
        currentCallId: currentCall?.id
      });

      setState(prev => ({
        ...prev,
        activeSession: data.updatedSession,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to proceed to next call',
        isLoading: false
      }));
    }
  };

  const getSessionProgress = () => {
    if (!state.activeSession) return 0;
    return (state.activeSession.currentIndex / state.activeSession.phoneNumbers.length) * 100;
  };

  return {
    ...state,
    startNewSession,
    proceedToNextCall,
    getSessionProgress
  };
};