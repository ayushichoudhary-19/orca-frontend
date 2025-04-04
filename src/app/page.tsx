// app/call/page.tsx
'use client';
import { useState } from 'react';
import { Dialer } from '@/components/Dialer/Dialer';
import { NumberPad } from '@/components/Dialer/NumberPad';
// import { CallHistory } from '@/components/Dialer/CallHistory';
import { useCallManager } from '@/hooks/useCallManager';
import { Container, Grid } from '@mantine/core';

export default function CallPage() {
  const { call, startCall, endCall, toggleMute, toggleSpeaker } = useCallManager();
  const [number, setNumber] = useState('');

  // const handleCall = () => {
  //   if (call.status === 'idle') {
  //     startCall(number);
  //   } else {
  //     endCall();
  //   }
  // };

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Dialer
            number={number}
            status={call.status}
            duration={call.duration}
            onCallStart={() => startCall(number)}
            onCallEnd={endCall}
            onMuteToggle={toggleMute}
            onSpeakerToggle={toggleSpeaker}
          />
          
          <NumberPad 
            value={number}
            onChange={setNumber}
            disabled={call.status !== 'idle'}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          {/* <CallHistory /> */}
        </Grid.Col>
      </Grid>
    </Container>
  );
}