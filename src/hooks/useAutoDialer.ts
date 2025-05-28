import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { axiosClient } from "@/lib/axiosClient";
import { toast } from "@/lib/toast";

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  mobileNumber?: string;
  title?: string;
  company?: string;
  location?: string;
  status?: string;
  city?: string;
  employeeCount?: string;
  revenue?: string;
  industry?: string;
  [key: string]: any;
}

type AutoDialStatus = "idle" | "running" | "paused";

export function useAutoDialer(startCall: (number: string) => void, endCall: () => void) {
  const [contacts, setContacts] = useState<Lead[]>([]);
  const [currentContact, setCurrentContact] = useState(0);
  const autoDialStatus = useRef<AutoDialStatus>("idle");

  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!campaignId) {
        console.log("useAutoDialer: No campaignId, skipping fetchLeads.");
        return;
      }
      console.log(`useAutoDialer: Fetching leads for campaignId: ${campaignId}`);
      try {
        const { data } = await axiosClient.get(`/api/leads/campaign/${campaignId}`);
        console.log("useAutoDialer: Leads fetched:", data);
        if (data && data.length > 0) {
          setContacts(data);
          setCurrentContact(0);
        } else {
          setContacts([]);
          setCurrentContact(0);
          console.warn("useAutoDialer: No leads found for this campaign.");
          toast.warn("No leads found for this campaign.");
        }
      } catch (error) {
        console.error("useAutoDialer: Failed to fetch leads:", error);
        toast.error("Failed to fetch leads.");
        setContacts([]);
      }
    };

    fetchLeads();
  }, [campaignId]);

  const getAutoDialStatus = useCallback((): AutoDialStatus => autoDialStatus.current, []);

  const startAutoDialing = useCallback(() => {
    if (autoDialStatus.current !== "idle") {
      console.warn(
        `useAutoDialer: Attempted to start dialing when status is already ${autoDialStatus.current}.`
      );
      return;
    }
    if (contacts.length === 0) {
      console.warn("useAutoDialer: No contacts loaded yet. Cannot start auto-dialing.");
      toast.warn("No contacts loaded. Auto-dialing cannot start.");
      return;
    }

    const contactToCall = contacts[currentContact];
    if (contactToCall && contactToCall.phone) {
      console.log(
        `useAutoDialer: Starting auto-dialing. Contact ${currentContact + 1}/${contacts.length}: ${contactToCall.fullName}`
      );
      autoDialStatus.current = "running";
      startCall(contactToCall.phone);
    } else {
      console.error(
        `useAutoDialer: No phone number for contact at index ${currentContact}. Cannot start call.`
      );
      toast.error("Current contact has no phone number. Auto-dialing cannot start.");
    }
  }, [contacts, currentContact, startCall, getAutoDialStatus]);

  const pauseAutoDialing = useCallback(() => {
    if (autoDialStatus.current === "running") {
      autoDialStatus.current = "paused";
      console.log("useAutoDialer: Auto-dialing paused.");
    }
  }, []);

  const stopAutoDialing = useCallback(() => {
    console.log("useAutoDialer: Stopping auto-dialing.");
    autoDialStatus.current = "idle";
    setCurrentContact(0);
    endCall();
  }, [endCall]);

  const goToNextContact = useCallback(() => {
    if (autoDialStatus.current !== "running") {
      console.log(`useAutoDialer: goToNextContact called but status is ${autoDialStatus.current}.`);
      return;
    }

    const nextIndex = currentContact + 1;
    console.log(
      `useAutoDialer: Advancing to next contact. Current: ${currentContact}, Next: ${nextIndex}, Total: ${contacts.length}`
    );

    if (nextIndex < contacts.length) {
      const nextContactDetails = contacts[nextIndex];
      if (nextContactDetails && nextContactDetails.phone) {
        setCurrentContact(nextIndex);
        console.log(`useAutoDialer: Calling next contact: ${nextContactDetails.fullName}`);
        startCall(nextContactDetails.phone);
      } else {
        console.warn(`useAutoDialer: Next contact (index ${nextIndex}) has no phone. Skipping.`);
        toast.warn(
          "Next contact has no phone number. Trying to find next valid contact or stopping."
        );
        setCurrentContact(nextIndex);
        autoDialStatus.current = "paused";
        toast.info("Auto-dialing paused: next contact has no phone number.");
      }
    } else {
      console.log("useAutoDialer: No more contacts to call. Auto-dialing session finished.");
      toast.success("All leads have been contacted!");
      autoDialStatus.current = "idle";
    }
  }, [currentContact, contacts, startCall]);

  return {
    contacts,
    currentContactData: contacts[currentContact] || null,
    currentContactIndex: currentContact,
    goToNextContact,
    startAutoDialing,
    pauseAutoDialing,
    stopAutoDialing,
    getAutoDialStatus,
  };
}
