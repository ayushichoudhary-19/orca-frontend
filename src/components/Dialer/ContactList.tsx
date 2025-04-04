'use client';
import { List, Paper, Text } from '@mantine/core';

interface Contact {
  name: string;
  number: string;
}

interface ContactListProps {
  contacts: Contact[];
  currentContact: number;
  onSelect: (contact: Contact) => void;
}

export const ContactList = ({ contacts, currentContact, onSelect }: ContactListProps) => {
  return (
    <Paper withBorder radius="md" p="md" mt="md">
      <Text fw={600} size="sm" mb="sm">Contact Queue</Text>
      <List spacing="xs" size="sm">
        {contacts.map((c, idx) => (
          <List.Item
            key={`${c.name}-${idx}`}
            className={`cursor-pointer ${idx === currentContact ? 'font-bold text-green-300' : ''}`}
            onClick={() => onSelect(c)}
          >
            {c.name} — {c.number}
          </List.Item>
        ))}
      </List>
    </Paper>
  );
};
