
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MeetingProvider as VideoSDKMeetingProvider, useMeeting as useVideoSDKMeeting, useParticipant } from "@videosdk.live/react-sdk";


type MeetingContextType = {
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
};

// VideoSDK configuration
const authToken = "YOUR_VIDEOSDK_AUTH_TOKEN"; // In a real app, you'd fetch this from your backend
const apiKey = "YOUR_VIDEOSDK_API_KEY"; // In a real app, you'd fetch this from your backend

// Create context
const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

// Internal wrapper for VideoSDK
const VideoSDKWrapper = ({ children }: { children: ReactNode }) => {
  const { 
    setIsAudioMuted, 
    setIsVideoOff, 
    setIsMeetingJoined, 
    setLocalParticipantId,
    isAudioMuted,
    isVideoOff,
    setMeetingId
  } = useContext(MeetingContext) as MeetingContextType;
  
  const { toast } = useToast();
  
  // Use the VideoSDK hook to access meeting methods
  const meeting = useVideoSDKMeeting({
    onMeetingJoined: () => {
      setIsMeetingJoined(true);
      toast({
        title: "Meeting joined successfully",
        duration: 2000,
      });
    },
    onMeetingLeft: () => {
      setIsMeetingJoined(false);
      toast({
        title: "Meeting ended",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error("VideoSDK error:", error);
      toast({
        title: "Error in meeting",
        description: error.message,
        duration: 4000,
        variant: "destructive"
      });
    }
  });
  
  // Set local participant ID when available
  useEffect(() => {
    if (meeting && meeting.localParticipant) {
      setLocalParticipantId(meeting.localParticipant.id);
    }
  }, [meeting, meeting?.localParticipant, setLocalParticipantId]);
  
  // Expose meeting methods to the main context
  useEffect(() => {
    if (meeting) {
      // Sync audio/video state with VideoSDK
      meeting.localParticipant.setMicEnabled(!isAudioMuted);
      meeting.localParticipant.setCameraEnabled(!isVideoOff);
    }
  }, [meeting, isAudioMuted, isVideoOff]);

  return <>{children}</>;
};

// Wrapper provider that handles all the video call state
export const MeetingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [localParticipantId, setLocalParticipantId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

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

  // Toggle audio using VideoSDK methods
  const toggleAudio = () => {
    setIsAudioMuted((prev) => !prev);
    toast({
      title: isAudioMuted ? "Microphone unmuted" : "Microphone muted",
      duration: 2000,
    });
  };

  // Toggle video using VideoSDK methods
  const toggleVideo = () => {
    setIsVideoOff((prev) => !prev);
    toast({
      title: isVideoOff ? "Camera turned on" : "Camera turned off",
      duration: 2000,
    });
  };

  const toggleAudioMode = () => {
    setIsAudioMode((prev) => !prev);
    toast({
      title: isAudioMode ? "Video mode enabled" : "Audio-only mode enabled",
      duration: 2000,
    });
  };

  const toggleScreenShare = () => {
    setShowShareModal(true);
  };

  const joinMeeting = () => {
    // Generate a random meeting ID for demo purposes
    const generatedMeetingId = `meeting-${Math.random().toString(36).substring(2, 7)}`;
    setMeetingId(generatedMeetingId);
    
    // In a real implementation, VideoSDK.initMeeting would be called here
  };

  const leaveMeeting = () => {
    setIsMeetingJoined(false);
    setElapsedTime(0);
    setMeetingId(null);
    setLocalParticipantId(null);
  };

  // Value object for the context
  const contextValue: MeetingContextType = {
    isMeetingJoined,
    isAudioMuted,
    isVideoOff,
    isAudioMode,
    elapsedTime,
    meetingId,
    localParticipantId,
    toggleAudio,
    toggleVideo,
    toggleAudioMode,
    toggleScreenShare,
    joinMeeting,
    leaveMeeting,
    showShareModal,
    setShowShareModal,
  };

  return (
    <MeetingContext.Provider value={contextValue}>
      {meetingId ? (
        <VideoSDKMeetingProvider
          config={{
            meetingId,
            micEnabled: !isAudioMuted,
            webcamEnabled: !isVideoOff,
            name: "User", // This should be dynamic in a real implementation
            participantId: localParticipantId || undefined,
          }}
          token={authToken}
        >
          <VideoSDKWrapper>{children}</VideoSDKWrapper>
        </VideoSDKMeetingProvider>
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