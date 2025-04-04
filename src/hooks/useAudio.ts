// hooks/useAudio.ts
import { useEffect, useRef } from 'react';

export const useAudio = (speaker: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = document.createElement('audio');
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.setSinkId(speaker ? '' : 'default')
        .catch(err => console.error('Audio routing error:', err));
    }
  }, [speaker]);

  return audioRef;
};