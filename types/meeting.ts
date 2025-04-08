export type MeetingContextType = {
    isMeetingJoined: boolean;
    isAudioMuted: boolean;
    isVideoOff: boolean;
    isAudioMode: boolean;
    elapsedTime: number;
    meetingId: string | null;
    localParticipantId: string | null;
    toggleAudio: () => void;
    toggleVideo: () => void;
    toggleAudioMode: () => void;
    toggleScreenShare: () => void;
    joinMeeting: () => void;
    leaveMeeting: () => void;
    showShareModal: boolean;
    setShowShareModal: (show: boolean) => void;
    // Internal state setters (not exposed to consumers)
    _setIsAudioMuted: (value: boolean) => void;
    _setIsVideoOff: (value: boolean) => void;
    _setIsMeetingJoined: (value: boolean) => void;
    _setLocalParticipantId: (value: string | null) => void;
    _setMeetingId: (value: string | null) => void;
  };
  