'use client';

import { useContext, createContext, useState, useEffect, useRef, ReactNode } from "react";

type Device = {
  id: string | null;
  label: string | null;
};

type Participant = {
  participantId: string;
  raisedHandOn: number;
};

type MeetingAppContextType = {
  selectedMic: Device;
  selectedWebcam: Device;
  selectedSpeaker: Device;
  isCameraPermissionAllowed: boolean | null;
  isMicrophonePermissionAllowed: boolean | null;
  raisedHandsParticipants: Participant[];
  sideBarMode: string | null;
  pipMode: boolean;

  setSelectedMic: (device: Device) => void;
  setSelectedWebcam: (device: Device) => void;
  setSelectedSpeaker: (device: Device) => void;
  setIsCameraPermissionAllowed: (allowed: boolean | null) => void;
  setIsMicrophonePermissionAllowed: (allowed: boolean | null) => void;
  setRaisedHandsParticipants: (participants: Participant[]) => void;
  setSideBarMode: (mode: string | null) => void;
  setPipMode: (mode: boolean) => void;
  
  useRaisedHandParticipants: () => { participantRaisedHand: (participantId: string) => void };
};

// Create context
export const MeetingAppContext = createContext<MeetingAppContextType | undefined>(undefined);

// Custom hook
export const useMeetingAppContext = () => {
  const context = useContext(MeetingAppContext);
  if (!context) {
    throw new Error("useMeetingAppContext must be used within a MeetingAppProvider");
  }
  return context;
};

// Provider component
type MeetingAppProviderProps = {
  children: ReactNode;
};

export const MeetingAppProvider = ({ children }: MeetingAppProviderProps) => {
  const [selectedMic, setSelectedMic] = useState<Device>({ id: null, label: null });
  const [selectedWebcam, setSelectedWebcam] = useState<Device>({ id: null, label: null });
  const [selectedSpeaker, setSelectedSpeaker] = useState<Device>({ id: null, label: null });
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = useState<boolean | null>(null);
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = useState<boolean | null>(null);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<Participant[]>([]);
  const [sideBarMode, setSideBarMode] = useState<string | null>(null);
  const [pipMode, setPipMode] = useState<boolean>(false);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<Participant[]>([]);

    const participantRaisedHand = (participantId: string) => {
      const raisedHands = [...(raisedHandsParticipantsRef.current || [])];

      const newItem: Participant = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHands.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHands.push(newItem);
      } else {
        raisedHands[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHands);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHands = [...(raisedHandsParticipantsRef.current || [])];
      const now = new Date().getTime();

      const persisted = raisedHands.filter(({ raisedHandOn }) => {
        return raisedHandOn + 15000 > now;
      });

      if (raisedHands.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  return (
    <MeetingAppContext.Provider
      value={{
        selectedMic,
        selectedWebcam,
        selectedSpeaker,
        isCameraPermissionAllowed,
        isMicrophonePermissionAllowed,
        raisedHandsParticipants,
        sideBarMode,
        pipMode,

        setSelectedMic,
        setSelectedWebcam,
        setSelectedSpeaker,
        setIsCameraPermissionAllowed,
        setIsMicrophonePermissionAllowed,
        setRaisedHandsParticipants,
        setSideBarMode,
        setPipMode,
        useRaisedHandParticipants,
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};
