'use client';

import { SessionTracker } from './Call/SessionTracker';
import { CallControls } from './Call/CallControls';
import { CallStats } from './Call/CallStats';
import { CallLogs } from './Call/CallLogs';
import { IncomingCallAlert } from './Call/IncomingCallAlert';
import { DashboardLayout } from './Layout';
import { useCallManager } from '../hooks/useCallManager';
import { useSessionManager } from '../hooks/useSessionManager';
import { LoadingOverlay } from '@mantine/core';

const CallInterface = () => {
  const {
    activeCall,
    callLogs,
    incomingCall,
    phoneNumber,
    setPhoneNumber,
    startCall,
    endCall,
    handleAcceptCall,
    handleRejectCall,
    isLoading: callLoading,
    error: callError
  } = useCallManager();

  const {
    activeSession,
    startNewSession,
    proceedToNextCall,
    isLoading: sessionLoading,
    error: sessionError
  } = useSessionManager();

  const isLoading = callLoading || sessionLoading;
  const error = callError || sessionError;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-4 gap-6 h-full p-6 relative">
        <LoadingOverlay visible={isLoading} />
        {error && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="col-span-1 bg-white rounded-xl p-4 shadow-lg">
          <SessionTracker 
            session={activeSession}
            onStartSession={startNewSession}
            onNextCall={proceedToNextCall}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <CallControls
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onCallStart={startCall}
              onCallEnd={endCall}
              isCallActive={!!activeCall}
              disabled={isLoading}
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg flex-1">
            <CallStats call={activeCall} />
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-xl p-4 shadow-lg">
          <CallLogs logs={callLogs} />
        </div>

        <IncomingCallAlert
          incomingCall={incomingCall}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      </div>
    </DashboardLayout>
  );
};

export default CallInterface;