import { TextInput, Button, Group } from '@mantine/core';
import { IconPhone, IconPhoneOff } from '@tabler/icons-react';

interface CallControlsProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onCallStart: () => void;
  onCallEnd: () => void;
  isCallActive: boolean;
  disabled?: boolean;
}

export const CallControls = ({
  phoneNumber,
  setPhoneNumber,
  onCallStart,
  onCallEnd,
  isCallActive,
  disabled
}: CallControlsProps) => {
  return (
    <Group align="flex-end">
      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.currentTarget.value)}
        disabled={isCallActive || disabled}
        style={{ flex: 1 }}
      />
      {isCallActive ? (
        <Button
          color="red"
          onClick={onCallEnd}
          disabled={disabled}
          leftSection={<IconPhoneOff size={20} />}
        >
          End Call
        </Button>
      ) : (
        <Button
          color="green"
          onClick={onCallStart}
          disabled={!phoneNumber || disabled}
          leftSection={<IconPhone size={20} />}
        >
          Start Call
        </Button>
      )}
    </Group>
  );
};