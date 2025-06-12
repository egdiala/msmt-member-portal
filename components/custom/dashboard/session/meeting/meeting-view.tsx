"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { ParticipantView } from "./participant-view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RenderIf } from "@/components/shared";
import { toast } from "sonner";
import ToolBar from "./tool-bar";
import { LeaveSessionModal } from "./leave-session-modal";

interface MeetingViewProps {
  isProvider?: boolean;
  meetingId: string;
  onMeetingLeft?: () => void;
  commMode?: "audio" | "video";
}

const MeetingView: React.FC<MeetingViewProps> = ({
  meetingId,
  isProvider,
  onMeetingLeft,
  commMode = "audio",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [layout, setLayout] = useState<"grid" | "focus">("focus");
  const [isMeetingJoined, setIsMeetingJoined] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMultiDeviceDialogOpen, setIsMultiDeviceDialogOpen] =
    useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  // Refs
  const meetingInitializedRef = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);
  const leavingInProgressRef = useRef(false);

  const router = useRouter();
  const isVideoEnabled = commMode === "video";

  // Meeting hook
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
      if (componentMountedRef.current) {
        setIsMeetingJoined(true);
      }
    },
    onParticipantJoined: (participant: any) => {
      if (
        componentMountedRef.current &&
        participant.id !== localParticipant?.id
      ) {
        const participantName = participant.displayName;
        toast.info(`${participantName} joined the meeting`);
      }
    },
    onParticipantLeft: (participant: any) => {
      if (
        componentMountedRef.current &&
        participant.id !== localParticipant?.id
      ) {
        const participantName = participant.displayName;
        toast.info(`${participantName} left the meeting`);
      }
    },
    onMeetingLeft: () => {
      if (componentMountedRef.current) {
        setIsMeetingJoined(false);
        if (onMeetingLeft) {
          onMeetingLeft();
        }
      }
    },
    onError: (error: any) => {
      if (!componentMountedRef.current) return;

      if (error.code === 4005) {
        setIsMultiDeviceDialogOpen(true);
      } else {
        toast.error(`Meeting error: ${error.message}`);
      }
    },
  });

  const leaveMeetingSafely = useCallback(async () => {
    if (leavingInProgressRef.current || isLeaving) return;

    leavingInProgressRef.current = true;
    setIsLeaving(true);

    try {
      await leave();

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }

      if (componentMountedRef.current && onMeetingLeft) {
        onMeetingLeft();
      }
    } catch (error) {
      console.error("Error leaving meeting:", error);
    } finally {
      if (componentMountedRef.current) {
        setIsMeetingJoined(false);
        setIsLeaving(false);
      }
      leavingInProgressRef.current = false;
    }
  }, [leave, onMeetingLeft, isLeaving]);

  const { publish, messages } = usePubSub("multi-device-control");

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      if (componentMountedRef.current) {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Component mount/unmount tracking
  useEffect(() => {
    componentMountedRef.current = true;

    return () => {
      componentMountedRef.current = false;
    };
  }, []);

  // PubSub message handling
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (
      latestMessage &&
      latestMessage.message === "force-leave" &&
      componentMountedRef.current
    ) {
      toast.info("You have been logged out due to login on another device.");
      leaveMeetingSafely();
    }
  }, [messages, leaveMeetingSafely]);

  // Multi-device dialog handlers
  const handleStayOnCurrentDevice = useCallback(() => {
    if (!componentMountedRef.current) return;

    setIsMultiDeviceDialogOpen(false);
    toast.info("Continuing meeting on this device");

    publish("force-leave", { persist: false });

    try {
      join();
    } catch (error) {
      console.error("Error rejoining the meeting:", error);
      if (componentMountedRef.current) {
        toast.error("Failed to rejoin the meeting");
      }
    }
  }, [publish, join]);

  const handleSwitchToOtherDevice = useCallback(async () => {
    if (!componentMountedRef.current) return;

    setIsMultiDeviceDialogOpen(false);
    toast.info("Ending meeting on this device");

    try {
      setIsLeaving(true);

      if (isMeetingJoined) {
        await leave();
      }

      if (onMeetingLeft) {
        onMeetingLeft();
      } else {
        window.close();
      }
    } catch (error) {
      console.error("Error leaving meeting:", error);

      window.close();
    }
  }, [isMeetingJoined, leave, onMeetingLeft, router]);

  // Browser events
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isMeetingJoined && !isLeaving) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isMeetingJoined, isLeaving]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        isMeetingJoined &&
        !isLeaving &&
        componentMountedRef.current
      ) {
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMeetingJoined, isLeaving]);

  // Cleanup on unmount
  useEffect(
    () => {
      return () => {
        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current);
        }

        if (isMeetingJoined && !leavingInProgressRef.current) {
          leaveMeetingSafely().catch(console.error);
        }
      };
    },
    // eslint-disable-next-line
    []
  );
  useEffect(() => {
    if (
      !meetingInitializedRef.current &&
      meetingId &&
      componentMountedRef.current
    ) {
      meetingInitializedRef.current = true;

      const timeout = setTimeout(() => {
        if (componentMountedRef.current) {
          join();
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [meetingId, join]);

  // Layout management
  useEffect(() => {
    if (isVideoEnabled) {
      setLayout("focus");
    } else {
      setLayout("grid");
    }
  }, [isVideoEnabled]);

  // Event handlers
  const handleToggleAudio = useCallback(() => {
    try {
      toggleMic();
    } catch (error) {
      console.error("Error toggling mic:", error);
    }
  }, [toggleMic]);

  const handleToggleVideo = useCallback(() => {
    if (!isVideoEnabled) {
      toast.error("Video toggle not allowed in audio-only mode");
      return;
    }

    try {
      toggleWebcam();
    } catch (error) {
      console.error("Error toggling webcam:", error);
    }
  }, [isVideoEnabled, toggleWebcam]);

  const handleEndCall = useCallback(
    async () => {
      try {
        setIsLeaving(true);

        if (isMeetingJoined) {
          await leave();
        }

        window.close();
      } catch (error) {
        console.error("Error ending call:", error);

        window.close();
      }
    },
    // eslint-disable-next-line
    [
      isProvider,
      participants,
      localParticipant?.id,
      isMeetingJoined,
      leave,
      router,
    ]
  );

  // Computed values
  const otherParticipants = [...participants.values()].filter(
    (p) => p?.id !== localParticipant?.id
  );
  const isAloneInMeeting =
    !!localParticipant && otherParticipants?.length === 0;

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      {/* Meeting header */}
      <div className="flex justify-between items-center py-2">
        <RenderIf condition={isAloneInMeeting}>
          <div className="text-center bg-blue-50 text-blue-700 py-2 px-4 rounded-lg">
            {`Waiting for ${!isProvider ? "Provider" : "Patient"} to join...`}
          </div>
        </RenderIf>

        {/* Mode indicator */}
        <div className="ml-auto">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-medium ${
              isVideoEnabled
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isVideoEnabled ? "Video Mode" : "Audio Only Mode"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative h-full">
        {layout === "focus" && (
          <div className="h-full flex flex-col">
            {isMobile ? (
              <div className="h-full flex flex-col pb-16 md:pb-20">
                <div className="flex-1 h-full relative">
                  {isAloneInMeeting ? (
                    !!localParticipant?.id && (
                      <ParticipantView
                        participantId={localParticipant?.id}
                        large={true}
                      />
                    )
                  ) : !!otherParticipants?.length ? (
                    <ParticipantView
                      participantId={otherParticipants[0]?.id}
                      large={true}
                    />
                  ) : null}

                  {!isAloneInMeeting && !!localParticipant?.id && (
                    <div className="flex flex-col p-2 gap-2 absolute top-2 right-2">
                      <div className="h-40 w-40 border-2 border-white rounded-lg overflow-hidden">
                        <ParticipantView
                          key={localParticipant?.id}
                          participantId={localParticipant?.id}
                          large={false}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {isAloneInMeeting ? (
                    localParticipant && (
                      <ParticipantView
                        participantId={localParticipant?.id}
                        large={true}
                      />
                    )
                  ) : !!otherParticipants.length ? (
                    <ParticipantView
                      participantId={otherParticipants[0]?.id}
                      large={true}
                    />
                  ) : null}

                  <RenderIf
                    condition={!isAloneInMeeting && !!localParticipant?.id}
                  >
                    <div className="h-48 flex w-52 absolute top-2 right-2">
                      <div className="h-full w-full border-2 rounded-lg overflow-hidden border-white">
                        <ParticipantView
                          key={localParticipant?.id}
                          participantId={localParticipant?.id}
                          large={false}
                        />
                      </div>
                    </div>
                  </RenderIf>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-full pb-16 md:pb-20">
          {layout === "grid" && (
            <div
              className={`grid ${
                [...participants.values()].length === 1
                  ? "grid-cols-1"
                  : [...participants.values()].length <= 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : [...participants.values()].length <= 4
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
              } gap-2 p-2 h-full`}
            >
              {[...participants.values()].map((participant) => (
                <ParticipantView
                  key={participant.id}
                  participantId={participant.id}
                  large={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* ToolBar */}
        <ToolBar
          localMicOn={localMicOn}
          localWebcamOn={localWebcamOn}
          isLeaving={isLeaving}
          handleEndCall={() => setIsOpen(true)}
          handleToggleAudio={handleToggleAudio}
          handleToggleVideo={handleToggleVideo}
          isVideoEnabled={isVideoEnabled}
        />
      </div>

      <AlertDialog
        open={isMultiDeviceDialogOpen}
        onOpenChange={setIsMultiDeviceDialogOpen}
      >
        <AlertDialogContent className="grid gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-base md:text-lg">
              Multiple Device Connection Detected
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs md:text-sm text-left">
              You appear to be joining this meeting from another device. Would
              you like to continue on this device or switch to the other device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex md:justify-end">
            <AlertDialogCancel onClick={handleSwitchToOtherDevice}>
              Switch to Other Device
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStayOnCurrentDevice}>
              Continue on This Device
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LeaveSessionModal
        open={isOpen}
        onOpenChange={setIsOpen}
        handleLeaveSession={handleEndCall}
      />
    </div>
  );
};

export default MeetingView;
