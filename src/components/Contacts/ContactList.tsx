'use client';
import { theme } from '@/app/theme';
import { List, Paper, Text, Title, ScrollArea, Avatar, Group, Badge } from '@mantine/core';
import { IconUser, IconPhone } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export interface Contact {
  name: string;
  number: string;
  address: string;
  email: string; 
}

interface ContactListProps {
  contacts: Contact[];
  currentContact: number;
  onSelect: (contact: Contact) => void;
}

export const ContactList = ({ contacts, currentContact, onSelect }: ContactListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Add this effect to handle auto-scrolling
  useEffect(() => {
    const currentContactElement = scrollAreaRef.current?.querySelector(`[data-index="${currentContact}"]`);
    if (currentContactElement) {
      currentContactElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentContact]);

  if (contacts.length === 0) {
    return (
      <Paper withBorder radius="md" p="md" mt="md" className="bg-transparent border">
        <Text c="#8b94a9" ta="center" py="xl" size='sm'>
          No contacts found
        </Text>
      </Paper>
    );
  }

  return (
    <Paper radius="md" p="md" mt="md"
    className='gradient-horizontal-light-2'
    >
      <Title order={4} mb="md" className="text-lg font-medium tracking-tight">
        Contact Queue
      </Title>
      <ScrollArea h="calc(70vh - 200px)" scrollbarSize={6} type="auto" viewportRef={scrollAreaRef}>
        <List spacing="xs" size="sm" center>
          {contacts.map((contact, idx) => (
            <motion.div
              key={`${contact.name}-${idx}`}
              data-index={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
             <Paper
  p="sm"
  m={3}
  radius="md"
  className={`relative cursor-pointer transition-all duration-200 mb-2 ${
    idx === currentContact ? 'bg-white' : 'hover:bg-white'
  }`}
  style={{
    backgroundColor:
      idx === currentContact ? 'white' : theme.colors?.ocean?.[0],
    borderLeft:
      idx === currentContact
        ? `4px solid ${theme.colors?.ocean?.[7]}`
        : undefined,
  }}
  onClick={() => onSelect(contact)}
>
  <Group justify="space-between">
    <Group>
      <Avatar 
        radius="xl" 
        color={idx === currentContact ? 'ocean' : 'gray'}
      >
        <IconUser size={20} />
      </Avatar>
      <div>
        <Text size="sm" fw={500} lineClamp={1} className="text-black">
          {contact.name}
        </Text>
        <Text size="xs" c="dimmed" className="flex items-center gap-1">
          <IconPhone size={12} />
          {contact.number}
        </Text>
      </div>
    </Group>

    {idx === currentContact && (
      <Badge variant="light" size="sm" color="ocean">
        Current
      </Badge>
    )}
  </Group>
</Paper>

            </motion.div>
          ))}
        </List>
      </ScrollArea>
    </Paper>
  );
};
