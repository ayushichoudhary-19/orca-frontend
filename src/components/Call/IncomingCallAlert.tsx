import { Modal, Text, Group, Button, Stack } from '@mantine/core';

interface IncomingCallAlertProps {
  incomingCall: {
    from: string;
    to: string;
  } | null;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallAlert = ({ incomingCall, onAccept, onReject }: IncomingCallAlertProps) => {
  return (
    <Modal
      opened={!!incomingCall}
      onClose={onReject}
      title="Incoming Call"
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      {incomingCall && (
        <Stack>
          <Text>Incoming call from {incomingCall.from}</Text>
          <Group justify="center" mt="md">
            <Button color="green" onClick={onAccept}>
              Accept
            </Button>
            <Button color="red" onClick={onReject}>
              Reject
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};