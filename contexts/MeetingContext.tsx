"use client";

import React, { createContext, useContext, ReactNode } from "react";
import VideoSDKProvider from "@/components/custom/dashboard/session/conferencing/video-sdk-provider";
import { useMeetingState } from "@/hooks/use-meeting-state";
import { MeetingContextType } from "@/types/meeting";

// Create context
const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const meetingState = useMeetingState();

  return (
    <MeetingContext.Provider value={meetingState}>
      {meetingState.meetingId ? (
        <VideoSDKProvider
          meetingId={meetingState.meetingId}
          isAudioMuted={meetingState.isAudioMuted}
          isVideoOff={meetingState.isVideoOff}
          localParticipantId={meetingState.localParticipantId}
        >
          {children}
        </VideoSDKProvider>
      ) : (
        children
      )}
    </MeetingContext.Provider>
  );
};

// Context hook to use the meeting context
export const useMeeting = (): MeetingContextType => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error("useMeeting must be used within a MeetingProvider");
  }
  return context;
};
