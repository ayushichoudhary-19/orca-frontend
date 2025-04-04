import { useState } from 'react';

export function useAutoDialer(startCallFn: (number: string) => void, endCallFn: () => void) {
  const [contacts, setContacts] = useState<{ name: string; number: string }[]>([]);
  const [currentContact, setCurrentContact] = useState(0);

  const handleUpload = (data: { name: string; number: string }[]) => {
    setContacts(data);
    setCurrentContact(0);
  };

  const goToNextContact = () => {
    if (currentContact + 1 < contacts.length) {
      setCurrentContact((prev) => prev + 1);
      const nextNumber = contacts[currentContact + 1].number;
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
