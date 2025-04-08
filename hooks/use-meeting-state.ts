"use client";

import { useState, useEffect } from "react";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export const useMeetingState = () => {
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [localParticipantId, setLocalParticipantId] = useState<string | null>(
    null
  );
  const [showShareModal, setShowShareModal] = useState(false);
  //   const { toast: uiToast } = useToast();

  // Timer for session
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isMeetingJoined) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMeetingJoined]);

  // Toggle audio
  const toggleAudio = () => {
    setIsAudioMuted((prev) => !prev);
    // uiToast({
    //   title: isAudioMuted ? "Microphone unmuted" : "Microphone muted",
    //   duration: 2000,
    // });
  };

  // Toggle video
  const toggleVideo = () => {
    setIsVideoOff((prev) => !prev);
    // uiToast({
    //   title: isVideoOff ? "Camera turned on" : "Camera turned off",
    //   duration: 2000,
    // });
  };

  const toggleAudioMode = () => {
    setIsAudioMode((prev) => !prev);
    // uiToast({
    //   title: !isAudioMode ? "Audio-only mode enabled" : "Video mode enabled",
    //   duration: 2000,
    // });
  };

  const toggleScreenShare = () => {
    setShowShareModal(true);
  };

  const joinMeeting = () => {
    if (meetingId) {
      console.log(`Joining meeting with ID: ${meetingId}`);
      setIsMeetingJoined(true);

      // Show toast notification
      toast.success("Meeting joined successfully");
    } else {
      console.error("Cannot join meeting: No meeting ID provided");
      toast.error("Cannot join meeting: Please enter a meeting ID");
    }
  };

  const leaveMeeting = () => {
    setIsMeetingJoined(false);
    setElapsedTime(0);
    setMeetingId(null);
    setLocalParticipantId(null);

    // Show toast notification
    toast.info("Meeting left");
  };

  return {
    // State
    isMeetingJoined,
    isAudioMuted,
    isVideoOff,
    isAudioMode,
    elapsedTime,
    meetingId,
    localParticipantId,
    showShareModal,

    // Actions
    toggleAudio,
    toggleVideo,
    toggleAudioMode,
    toggleScreenShare,
    joinMeeting,
    leaveMeeting,
    setShowShareModal,

    // Internal setters
    _setIsAudioMuted: setIsAudioMuted,
    _setIsVideoOff: setIsVideoOff,
    _setIsMeetingJoined: setIsMeetingJoined,
    _setLocalParticipantId: setLocalParticipantId,
    _setMeetingId: setMeetingId,
  };
};
