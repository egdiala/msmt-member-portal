"use client";
import React, { useState, useEffect, useRef } from "react";
import { RatingDialog } from "../../appointments/rating-form";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import {
  IconMic,
  IconMicOff,
  IconVideoOff,
  IconShare2,
  IconVideo,
  IconEndCall,
  IconUsers,
  IconClock,
} from "@/components/icons";
import { RenderIf } from "@/components/shared";

interface MeetingViewProps {
  isProvider?: boolean;
  meetingId: string;
  participantName?: string;
  onMeetingLeft?: () => void;
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
    <div className="text-sm md:text-lg bg-gray-100 font-semibold text-[#001933] py-1.5 px-2 border border-brand-accent-2 rounded-full flex items-center">
      <IconClock className="w-4 h-4 md:w-6 md:h-6 mr-1 stroke-brand-1" />
      {formatTime(time)}
    </div>
  );
};

const MeetingView: React.FC<MeetingViewProps> = ({
  isProvider = false,
  meetingId,
  participantName,
  onMeetingLeft,
}) => {
  const [layout, setLayout] = useState<"grid" | "focus">("focus");
  const [isMeetingJoined, setIsMeetingJoined] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const meetingInitializedRef = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);

  // Save participant name to localStorage if provided
  useEffect(() => {
    if (participantName) {
      window.localStorage.setItem("videosdk-participant-name", participantName);
    }
  }, [participantName]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      componentMountedRef.current = false;
    };
  }, []);

  const leaveMeetingSafely = async () => {
    if (isLeaving) return;

    setIsLeaving(true);
    try {
      await leave();
      console.log("Meeting left successfully");

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      if (componentMountedRef.current && onMeetingLeft) {
        onMeetingLeft();
      }
    } catch (error) {
      console.error("Error leaving meeting:", error);
    } finally {
      setIsMeetingJoined(false);
      setIsLeaving(false);
    }
  };

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
      console.log("Meeting left from SDK callback");
      setIsMeetingJoined(false);

      if (onMeetingLeft && componentMountedRef.current) {
        onMeetingLeft();
      }
    },
    onError: (error) => {
      console.error("Error in meeting:", error);
    },
  });

  // Handle beforeunload event for page navigation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isMeetingJoined && !isLeaving) {
        try {
          leave();
          console.log("Meeting left during page unload");
        } catch (error) {
          console.error("Error leaving meeting during unload:", error);
        }
      }

      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isMeetingJoined, isLeaving, leave]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      if (isMeetingJoined && !isLeaving) {
        leaveMeetingSafely();
      }
    };
  }, [isMeetingJoined, isLeaving]);

  // Join meeting when component mounts
  useEffect(() => {
    if (!meetingInitializedRef.current && meetingId) {
      meetingInitializedRef.current = true;
      const timeout = setTimeout(() => {
        join();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [meetingId, join]);

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

  const handleEndCall = async () => {
    try {
      if (isMeetingJoined) {
        await leaveMeetingSafely();
      }

      if (componentMountedRef.current) {
        redirectTimeoutRef.current = setTimeout(() => {
          window.location.href = "/call-ended";
        }, 300);
      }
    } catch (error) {
      console.error("Error ending call:", error);
      window.location.href = "/call-ended";
    }
  };

  const handleToggleLayout = () => {
    setLayout((prev) => (prev === "grid" ? "focus" : "grid"));
  };

  const getActiveParticipants = () => {
    return [...participants.values()].filter((p) =>
      ["SEND_AND_RECV", "RECV_ONLY", "SEND_ONLY"].includes(p.mode)
    );
  };

  const activeParticipantsArray = getActiveParticipants();
  const isAloneInMeeting = activeParticipantsArray.length <= 1;

  // Find the appropriate participant to focus on
  const focusParticipant = (() => {
    if (isAloneInMeeting) {
      return localParticipant;
    }

    if (isProvider) {
      // Provider should see the other participant (patient)
      return (
        activeParticipantsArray.find((p) => p.id !== localParticipant?.id) ||
        localParticipant
      );
    } else {
      // Patient should see themselves first
      return localParticipant || activeParticipantsArray[0];
    }
  })();

  const otherParticipants = activeParticipantsArray.filter(
    (p) => p?.id !== focusParticipant?.id
  );

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      {/* Meeting header */}
      <div className="flex justify-between items-center py-2">
        {/* Display waiting message when alone */}
        <RenderIf condition={isAloneInMeeting}>
          <div className="text-center bg-blue-50 text-blue-700 py-2 px-4 rounded-lg">
            Waiting for others to join...
          </div>
        </RenderIf>

        {/* Layout toggle button */}
        <button
          onClick={handleToggleLayout}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <IconUsers className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {layout === "focus" && (
          <div className="h-full flex flex-col">
            {isMobile ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {/* Show only the local participant if alone */}
                  {isAloneInMeeting ? (
                    localParticipant && (
                      <ParticipantView
                        participantId={localParticipant.id}
                        large={true}
                        isProvider={isProvider}
                      />
                    )
                  ) : otherParticipants?.[0] ? (
                    <ParticipantView
                      participantId={otherParticipants[0].id}
                      large={true}
                      isProvider={isProvider}
                    />
                  ) : null}

                  {/* Only show the small self-view if not alone */}
                  {!isAloneInMeeting && localParticipant && (
                    <div className="flex flex-col p-2 gap-2 absolute top-2 right-2">
                      <div className="h-32 w-40 border-2 border-white rounded-lg overflow-hidden">
                        <ParticipantView
                          key={localParticipant.id}
                          participantId={localParticipant.id}
                          large={false}
                          isProvider={isProvider}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {/* Show local participant if alone, otherwise show the other participant */}
                  {isAloneInMeeting ? (
                    localParticipant && (
                      <ParticipantView
                        participantId={localParticipant.id}
                        large={true}
                        isProvider={isProvider}
                      />
                    )
                  ) : otherParticipants.length > 0 ? (
                    <ParticipantView
                      participantId={otherParticipants[0].id}
                      large={true}
                      isProvider={isProvider}
                    />
                  ) : null}

                  {/* Only show small self-view if not alone */}
                  {!isAloneInMeeting && localParticipant && (
                    <div className="h-32 flex w-52 absolute top-2 right-2 gap-2 p-2">
                      <div className="h-full aspect-video border-2 rounded-lg overflow-hidden border-white">
                        <ParticipantView
                          key={localParticipant.id}
                          participantId={localParticipant.id}
                          large={false}
                          isProvider={isProvider}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pb-20 h-full">
          {layout === "grid" && (
            <div
              className={`grid ${
                activeParticipantsArray.length === 1
                  ? "grid-cols-1"
                  : activeParticipantsArray.length <= 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : activeParticipantsArray.length <= 4
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
              } gap-2 p-2 h-full`}
            >
              {activeParticipantsArray.map((participant) => (
                <ParticipantView
                  key={participant.id}
                  participantId={participant.id}
                  large={false}
                  isProvider={isProvider}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex absolute inset-x-0 bottom-0 justify-between w-full items-center gap-4 p-2 bg-transparent">
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            aria-label="Share screen"
          >
            <IconShare2 className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
          </button>
          <div className="flex justify-center items-center gap-4 ">
            <button
              onClick={handleToggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                localMicOn
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-brand-accent-2 text-white hover:opacity-90"
              } transition-colors`}
              aria-label={localMicOn ? "Mute microphone" : "Unmute microphone"}
            >
              {localMicOn ? (
                <IconMic className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
              ) : (
                <IconMicOff className="md:w-5 w-4 md:h-5 h-4 stroke-white" />
              )}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                localWebcamOn
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-brand-accent-2 text-white hover:opacity-90"
              } transition-colors`}
              aria-label={localWebcamOn ? "Turn off camera" : "Turn on camera"}
            >
              {localWebcamOn ? (
                <IconVideo className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
              ) : (
                <IconVideoOff className="md:w-5 w-4 md:h-5 h-4 stroke-white" />
              )}
            </button>

            <button
              onClick={handleEndCall}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
              aria-label="End call"
              disabled={isLeaving}
            >
              <IconEndCall className="md:w-5 w-4 md:h-5 h-4 stroke-white" />
            </button>
          </div>

          <Timer />
        </div>
      </div>
      <RatingDialog
        open={open}
        onOpenChange={setOpen}
        personName={data?.provider_data?.name}
      />
    </div>
  );
};

const ParticipantView = ({
  participantId,
  large = false,
  isProvider,
}: {
  participantId: string;
  large: boolean;
  isProvider: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { webcamStream, micStream, webcamOn, micOn, displayName, isLocal } =
    useParticipant(participantId);

  // Get participant name from various sources
  const meetingProviderData =
    typeof document !== "undefined"
      ? document
          .querySelector("[data-participant-name]")
          ?.getAttribute("data-participant-name")
      : null;
  const storedName =
    typeof window !== "undefined"
      ? window.localStorage.getItem("videosdk-participant-name")
      : null;

  const name = isLocal
    ? storedName || meetingProviderData || displayName || "You"
    : displayName || "Participant";

  const activeRole = isProvider ? "Provider" : "Patient";
  const role = isLocal ? "You" : activeRole;
  const firstLetter = (name?.charAt(0) || "?").toUpperCase();

  // Handle microphone audio stream
  useEffect(() => {
    if (micStream && audioRef.current) {
      const mediaStream = new MediaStream();

      if (micStream.track instanceof MediaStreamTrack) {
        mediaStream.addTrack(micStream.track);
        audioRef.current.srcObject = mediaStream;
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [micStream]);

  // Handle webcam video stream
  useEffect(() => {
    if (webcamStream && videoRef.current) {
      const mediaStream = new MediaStream();

      if (webcamStream.track instanceof MediaStreamTrack) {
        mediaStream.addTrack(webcamStream.track);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [webcamStream]);

  return (
    <div
      className={`relative rounded-lg overflow-hidden ${
        large ? "h-full w-full" : "h-full w-full"
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
        <div className="flex items-center justify-center w-full h-full bg-blue-400 text-white">
          <div className="w-20 h-20 flex items-center justify-center bg-brand-accent-2 rounded-full text-3xl font-medium">
            {firstLetter}
          </div>
        </div>
      )}

      {micOn && !isLocal && <audio ref={audioRef} autoPlay />}

      {/* Participant info overlay */}
      <div className="absolute bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center">
        <span>{role}</span>

        <span className="ml-2 text-red-500">
          {!micOn && <IconMicOff className="w-4 h-4 stroke-red-500" />}
          {micOn && <IconMic className="w-4 h-4 stroke-brand-1" />}
        </span>
      </div>
    </div>
  );
};

export default MeetingView;
export { ParticipantView };
