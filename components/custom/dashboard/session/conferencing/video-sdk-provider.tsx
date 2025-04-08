"use client";

import React, { useState, useEffect, ReactNode } from "react";

const authToken = "YOUR_VIDEOSDK_AUTH_TOKEN";
// const apiKey = "YOUR_VIDEOSDK_API_KEY";
interface VideoSDKProviderProps {
  children: ReactNode;
  meetingId: string;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  localParticipantId: string | null;
}

const VideoSDKProvider = ({
  children,
  meetingId,
  isAudioMuted,
  isVideoOff,
  localParticipantId,
}: VideoSDKProviderProps) => {
  const [MeetingProvider, setMeetingProvider] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamically import MeetingProvider only on the client side
    const loadMeetingProvider = async () => {
      try {
        const videoSDK = await import("@videosdk.live/react-sdk");
        setMeetingProvider(() => videoSDK.MeetingProvider);
      } catch (error) {
        console.error("Error loading VideoSDK:", error);
      }
    };

    loadMeetingProvider();
  }, []);

  if (!MeetingProvider) {
    return <>{children}</>;
  }

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: !isAudioMuted,
        webcamEnabled: !isVideoOff,
        name: "User",
        participantId: localParticipantId || undefined,
        debugMode: false,
      }}
      token={authToken}
    >
      {children}
    </MeetingProvider>
  );
};

export default VideoSDKProvider;
