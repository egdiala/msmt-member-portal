"use client";

import { useState, useEffect } from "react";

export function useVideoSDKHooks() {
  const [videoSDK, setVideoSDK] = useState<any>(null);

  useEffect(() => {
    const importVideoSDK = async () => {
      try {
        const sdk = await import("@videosdk.live/react-sdk");
        setVideoSDK(sdk);
      } catch (error) {
        console.error("Failed to import VideoSDK:", error);
      }
    };

    importVideoSDK();
  }, []);

  return videoSDK;
}

export function useVideoSDKMeeting(options?: any) {
  const [meetingState, setMeetingState] = useState<any>(null);
  const videoSDK = useVideoSDKHooks();

  useEffect(() => {
    if (!videoSDK || !videoSDK.useMeeting) return;

    try {
      const meeting = videoSDK.useMeeting(options);
      setMeetingState(meeting);
    } catch (error) {
      console.error("Error in useMeeting:", error);
    }
  }, [videoSDK, options]);

  return meetingState || { participants: new Map() };
}

export function useVideoSDKParticipant(participantId: string) {
  const [participant, setParticipant] = useState<any>(null);
  const videoSDK = useVideoSDKHooks();

  useEffect(() => {
    if (!videoSDK || !videoSDK.useParticipant || !participantId) return;

    try {
      const participantData = videoSDK.useParticipant(participantId);
      setParticipant(participantData);
    } catch (error) {
      console.error("Error in useParticipant:", error);
    }
  }, [videoSDK, participantId]);

  return (
    participant || {
      webcamStream: null,
      webcamOn: false,
      displayName: "",
      isLocal: false,
      micOn: false,
    }
  );
}
