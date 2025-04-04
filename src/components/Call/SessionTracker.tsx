// components/CallComponents/SessionTracker.tsx
import { Progress, Button, Text, Textarea } from '@mantine/core';
import { useState } from 'react';

interface Session {
  id: string;
  phoneNumbers: string[];
  currentIndex: number;
  isComplete: boolean;
}

interface SessionTrackerProps {
  session: Session | null;
  onStartSession: (numbers: string[]) => void;
  onNextCall: () => void;
}

export const SessionTracker = ({ session, onStartSession, onNextCall }: SessionTrackerProps) => {
  const [numbers, setNumbers] = useState('');

  const handleStartSession = () => {
    const phoneNumbers = numbers.split(',').map(n => n.trim()).filter(Boolean);
    if (phoneNumbers.length > 0) {
      onStartSession(phoneNumbers);
      setNumbers('');
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <Text size="lg" fw={500}>Start New Session</Text>
        <Textarea
          placeholder="Enter comma-separated phone numbers"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          minRows={3}
          autosize
        />
        <Button onClick={handleStartSession} disabled={!numbers.trim()}>
          Start Session
        </Button>
      </div>
    );
  }

  const progress = (session.currentIndex / session.phoneNumbers.length) * 100;

  return (
    <div className="flex flex-col gap-4">
      <Text size="lg" fw={500}>Session Progress</Text>
      <Progress value={progress} 
      // label={`${session.currentIndex + 1}/${session.phoneNumbers.length}`} 
      />
      <Text size="sm" c="dimmed">
        Next: {session.phoneNumbers[session.currentIndex]}
      </Text>
      <Button onClick={onNextCall} disabled={session.currentIndex >= session.phoneNumbers.length}>
        Next Call
      </Button>
    </div>
  );
};