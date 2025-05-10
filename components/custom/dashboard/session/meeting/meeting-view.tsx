"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import {
  IconMic,
  IconMicOff,
  IconVideoOff,
  IconShare2,
  IconVideo,
  IconEndCall,
  IconUsers,
} from "@/components/icons";

interface MeetingViewProps {
  isProvider?: boolean;
  meetingId: string;
  participantName?: string;
}

const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-sm font-medium text-gray-700 flex items-center">
      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
      {formatTime(time)}
    </div>
  );
};

const MeetingView: React.FC<MeetingViewProps> = ({
  isProvider = false,
  meetingId,
  participantName,
}) => {
  // State variables
  const [layout, setLayout] = useState<"grid" | "focus">("focus");
  const [isMeetingJoined, setIsMeetingJoined] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const meetingInitializedRef = useRef(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Use the VideoSDK hook with updated callbacks
  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    participants,
    localParticipant,
    localMicOn,
    localWebcamOn,
  } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined successfully");
      setIsMeetingJoined(true);
    },
    onMeetingLeft: () => {
      console.log("Meeting left");
      setIsMeetingJoined(false);
    },
    onError: (error) => {
      console.error("Error in meeting:", error);
    },
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isMeetingJoined) {
        try {
          leave();
        } catch (error) {
          console.error("Error leaving meeting:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isMeetingJoined) {
        try {
          // leave();
        } catch (error) {
          console.error("Error leaving meeting during cleanup:", error);
        }
      }
    };
  }, [isMeetingJoined, leave]);

  useEffect(() => {
    if (!meetingInitializedRef.current && meetingId) {
      meetingInitializedRef.current = true;

      const timeout = setTimeout(() => {
        join();
        console.log("Joining meeting with ID:", meetingId);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [meetingId]);

  const handleToggleAudio = () => {
    try {
      console.log("Toggling microphone, current state:", localMicOn);
      toggleMic();
    } catch (error) {
      console.error("Error toggling mic:", error);
    }
  };

  const handleToggleVideo = () => {
    try {
      console.log("Toggling webcam, current state:", localWebcamOn);
      toggleWebcam();
    } catch (error) {
      console.error("Error toggling webcam:", error);
    }
  };

  const handleEndCall = () => {
    try {
      if (isMeetingJoined) {
        leave();
      }
      // Redirect to post-call page
      window.location.href = "/call-ended";
    } catch (error) {
      console.error("Error ending call:", error);
      // Force redirect even if there was an error
      window.location.href = "/call-ended";
    }
  };

  const handleToggleLayout = () => {
    setLayout((prev) => (prev === "grid" ? "focus" : "grid"));
  };

  const participantsArray = [...participants.values()].filter(
    (p) => p.mode === "SEND_AND_RECV"
  );

  const focusParticipant = isProvider
    ? participantsArray.find((p) => p.id !== localParticipant?.id) ||
      participantsArray[0]
    : participantsArray.find((p) => p.id === localParticipant?.id) ||
      participantsArray[0];

  const otherParticipants = participantsArray.filter((p) =>
    focusParticipant ? p.id !== focusParticipant.id : true
  );

  console.log("Participants:", participantsArray);
  console.log("Focus participant:", focusParticipant);
  console.log("Other participants:", otherParticipants);

  if (!isMeetingJoined) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] bg-transparent">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-700">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Meeting header */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {isProvider ? "Patient Session" : "Provider Session"}
            </h1>
            <Timer />
          </div>
        </div>

        {/* Add layout toggle button */}
        <button
          onClick={handleToggleLayout}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <IconUsers className="w-5 h-5 stroke-brand-1" />
        </button>
      </div>

      {/* Meeting content - using the exact layout from the reference images */}
      <div className="flex-1 bg-gray-100 overflow-hidden relative">
        {layout === "focus" && (
          <div className="h-full flex flex-col">
            {isMobile ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {focusParticipant && (
                    <ParticipantView
                      key={focusParticipant.id}
                      participantId={focusParticipant.id}
                      large={true}
                    />
                  )}
                </div>
                {otherParticipants.length > 0 && (
                  <div className="flex flex-col p-2 gap-2">
                    {otherParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="h-24 rounded-lg overflow-hidden"
                      >
                        <ParticipantView
                          participantId={participant.id}
                          large={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Desktop layout - main video with thumbnails on bottom */
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {focusParticipant && (
                    <ParticipantView
                      key={focusParticipant.id}
                      participantId={focusParticipant.id}
                      large={true}
                    />
                  )}
                </div>
                {otherParticipants.length > 0 && (
                  <div className="h-32 flex w-52 absolute top-2 right-2 gap-2 p-2 ">
                    {otherParticipants.map((participant) => (
                      <div key={participant.id} className="h-full aspect-video">
                        <ParticipantView
                          participantId={participant.id}
                          large={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {layout === "grid" && (
          <div
            className={`grid ${
              participantsArray.length === 1
                ? "grid-cols-1"
                : participantsArray.length <= 2
                ? "grid-cols-1 md:grid-cols-2"
                : participantsArray.length <= 4
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
            } gap-2 p-2 h-full`}
          >
            {participantsArray.map((participant) => (
              <ParticipantView
                key={participant.id}
                participantId={participant.id}
                large={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls - designed to match the reference images */}
      <div className="flex justify-center items-center gap-4 p-4 bg-white border-t">
        <button
          onClick={handleToggleAudio}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            localMicOn
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-red-500 text-white hover:bg-red-600"
          } transition-colors`}
          aria-label={localMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {localMicOn ? (
            <IconMic className="w-5 h-5 stroke-brand-1" />
          ) : (
            <IconMicOff className="w-5 h-5 stroke-white" />
          )}
        </button>

        <button
          onClick={handleToggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            localWebcamOn
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-red-500 text-white hover:bg-red-600"
          } transition-colors`}
          aria-label={localWebcamOn ? "Turn off camera" : "Turn on camera"}
        >
          {localWebcamOn ? (
            <IconVideo className="w-5 h-5 stroke-brand-1" />
          ) : (
            <IconVideoOff className="w-5 h-5 stroke-white" />
          )}
        </button>

        <button
          onClick={handleEndCall}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
          aria-label="End call"
        >
          <IconEndCall className="w-5 h-5 stroke-white" />
        </button>

        <button
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          aria-label="Share screen"
        >
          <IconShare2 className="w-5 h-5 stroke-brand-1" />
        </button>
      </div>
    </div>
  );
};

// Individual participant view component - fixed to handle streams correctly
const ParticipantView = ({
  participantId,
  large = false,
}: {
  participantId: string;
  large: boolean;
}) => {
  const videoRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, displayName, isLocal } =
    useParticipant(participantId);

  useEffect(() => {
    if (webcamStream?.track instanceof MediaStreamTrack && videoRef.current) {
      const mediaStream = new MediaStream([webcamStream.track]);
      (videoRef.current as any).srcObject = mediaStream;
    }
  }, [webcamStream]);
  const name = displayName || (isLocal ? "You" : "User");
  const role = isLocal ? "You" : "Provider";
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${
        large ? "h-[80vh] w-full" : "h-full w-full"
      }`}
    >
      {webcamOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-700 text-white">
          <div className="w-20 h-20 flex items-center justify-center bg-blue-600 rounded-full text-3xl font-medium">
            {firstLetter}
          </div>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
        <span>{name}</span>
        {!micOn && (
          <span className="ml-2 text-red-500">
            <IconMicOff className="w-4 h-4 stroke-white" />
          </span>
        )}
      </div>

      {/* Role tag in top left */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
        {role}
      </div>
    </div>
  );
};

export default MeetingView;
export { ParticipantView };
