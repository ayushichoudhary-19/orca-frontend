import { Contact } from '@/components/Contacts/ContactList';
import { useState } from 'react';

export function useAutoDialer(startCallFn: (number: string) => void, endCallFn: () => void) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState(0);

  const handleUpload = (data: Contact[]) => {
    setContacts(data);
    setCurrentContact(0);
  };

  const goToNextContact = () => {
    if (currentContact + 1 < contacts.length) {
      const nextIndex = currentContact + 1;
      setCurrentContact(nextIndex);
      const nextNumber = contacts[nextIndex].number;
      startCallFn(nextNumber);
    }
  };

  const setManualNumber = (number: string) => {
    endCallFn(); // forcefully end current if switching manually
    startCallFn(number);
  };

  return {
    contacts,
    currentContact,
    handleUpload,
    goToNextContact,
    setManualNumber,
  };
}
