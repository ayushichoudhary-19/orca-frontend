import { useState, useCallback, useRef } from "react";
import { Contact } from "@/components/Contacts/ContactList";

type AutoDialStatus = "idle" | "running" | "paused";

export function useAutoDialer(startCall: (number: string) => void, endCall: () => void) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState(0);
  const [manualNumber, setManualNumber] = useState<string>("");
  const autoDialStatus = useRef<AutoDialStatus>("idle");

  const handleUpload = (newContacts: Contact[]) => {
    setContacts(newContacts);
    setCurrentContact(0);
  };

  const getAutoDialStatus = (): AutoDialStatus => autoDialStatus.current;

  const goToNextContact = useCallback(() => {
    if (autoDialStatus.current !== "running") return;
    const nextIndex = currentContact + 1;
    if (nextIndex < contacts.length) {
      setCurrentContact(nextIndex);
      startCall(contacts[nextIndex].number);
    } else {
      autoDialStatus.current = "idle";
    }
  }, [currentContact, contacts, startCall]);

  const incrementContactIndex = () => {
    setCurrentContact((prev) => {
      const next = prev + 1;
      if (next >= contacts.length) {
        autoDialStatus.current = "idle";
        return prev;
      }
      return next;
    });
  };

  const startAutoDialing = () => {
    autoDialStatus.current = "running";
    const current = contacts[currentContact];
    if (current) startCall(current.number);
  };

  const pauseAutoDialing = () => {
    autoDialStatus.current = "paused";
  };

  const stopAutoDialing = () => {
    autoDialStatus.current = "idle";
    setCurrentContact(0);
    endCall();
  };

  return {
    contacts,
    currentContact,
    manualNumber,
    handleUpload,
    goToNextContact,
    setManualNumber,
    startAutoDialing,
    pauseAutoDialing,
    stopAutoDialing,
    getAutoDialStatus,
    incrementContactIndex,
  };
}
