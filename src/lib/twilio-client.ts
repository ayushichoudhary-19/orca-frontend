import { Device, Call } from '@twilio/voice-sdk';

interface TwilioDeviceOptions {
  codecPreferences: string[];
  fakeLocalDTMF: boolean;
  enableRingingState: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'off';
  closeProtection: boolean; // Add close protection
  maxCallSignalingTimeoutMs: number; // Add timeout
}

const defaultOptions: TwilioDeviceOptions = {
  codecPreferences: ['opus', 'pcmu'],
  fakeLocalDTMF: true,
  enableRingingState: true,
  logLevel: 'debug',
  closeProtection: true,
  maxCallSignalingTimeoutMs: 30000 // 30 seconds timeout
};

export const setupTwilioDevice = async (token: string, options?: Partial<TwilioDeviceOptions>) => {
  try {
    const device = new Device(token, {
      ...defaultOptions,
      ...(options as Device.Options)
    });

    device.on('error', (error) => {
      console.error('Twilio Device Error:', error);
      if (error.code === 31005) {
        // Handle gateway connection error
        device.disconnectAll();
        // Attempt to reconnect
        device.register();
      }
    });

    device.on('disconnect', (connection) => {
      console.log('Call disconnected:', connection.parameters);
    });

    device.on('offline', () => {
      console.warn('Device went offline, attempting to reconnect...');
      device.register();
    });

    await device.register();
    return device;
  } catch (error) {
    console.error('Failed to setup Twilio device:', error);
    throw error;
  }
};

export const connectCall = async (device: Device, phoneNumber: string): Promise<Call> => {
  try {
    const connection = device.connect({ 
      params: { 
        To: phoneNumber,
      }
    });

    // connection.on('error', (error) => {
    //   console.error('Call Error:', error);
    //   if (error.code === 31005) {
    //     connection.disconnect();
    //   }
    // });

    return connection;
  } catch (error) {
    console.error('Failed to connect call:', error);
    throw error;
  }
};

export const disconnectCall = (connection: Call) => {
  try {
    if (connection && connection.status() !== 'closed') {
      connection.disconnect();
    }
  } catch (error) {
    console.error('Failed to disconnect call:', error);
    throw error;
  }
};