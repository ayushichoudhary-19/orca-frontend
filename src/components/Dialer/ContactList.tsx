'use client';
import { List, Paper, Text, Title, ScrollArea, Avatar, Group, Badge } from '@mantine/core';
import { IconUser, IconPhone } from '@tabler/icons-react';
import { motion } from 'framer-motion';

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
  if (contacts.length === 0) {
    return (
      <Paper withBorder radius="md" p="md" mt="md" className=" ">
        <Text c="dimmed" ta="center" py="xl" size='sm'>
          Upload a CSV file to see contacts here
        </Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="md" mt="md" className=" ">
      <Title order={4} mb="md" className="text-lg font-medium tracking-tight">
        Contact Queue
      </Title>
      <ScrollArea h={300} scrollbarSize={6} type="auto">
        <List spacing="xs" size="sm" center>
          {contacts.map((contact, idx) => (
            <motion.div
              key={`${contact.name}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Paper
                p="sm"
                radius="md"
                className={`cursor-pointern transition-all duration-200 mb-2 ${
                  idx === currentContact 
                    ? 'bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-500/50' 
                    : 'hover:bg-white/5'
                }`}
                onClick={() => onSelect(contact)}
              >
                <Group justify="space-between">
                  <Group>
                    <Avatar 
                      radius="xl" 
                      color={idx === currentContact ? "violet" : "gray"}
                      className="border-2 border-opacity-50"
                    >
                      <IconUser size={20} />
                    </Avatar>
                    <div>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {contact.name}
                      </Text>
                      <Text size="xs" c="dimmed" className="flex items-center gap-1">
                        <IconPhone size={12} />
                        {contact.number}
                      </Text>
                    </div>
                  </Group>
                  
                  {idx === currentContact && (
                    <Badge color="violet" variant="light" size="sm">
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
