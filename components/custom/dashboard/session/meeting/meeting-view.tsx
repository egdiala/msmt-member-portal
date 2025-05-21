"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMeeting } from "@videosdk.live/react-sdk";
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
import { RatingDialog } from "../../appointments/rating-form";
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
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<"grid" | "focus">("focus");
  const [isMeetingJoined, setIsMeetingJoined] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMultiDeviceDialogOpen, setIsMultiDeviceDialogOpen] =
    useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const [, setUserConfirmedLeave] = useState<boolean>(false);
  const meetingInitializedRef = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);
  const router = useRouter();

  const isVideoEnabled = commMode === "video";

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
      setIsMeetingJoined(true);
    },
    onMeetingLeft: () => {
      setIsMeetingJoined(false);

      if (onMeetingLeft && componentMountedRef.current) {
        onMeetingLeft();
      }
    },
    onError: (error: any) => {
      if (error.code === 4005) {
        setIsMultiDeviceDialogOpen(true);
      } else {
        toast.error(`Meeting error: ${error.message}`);
      }
    },
  });
  const handleStayOnCurrentDevice = () => {
    setIsMultiDeviceDialogOpen(false);
    toast.info("Continuing meeting on this device");

    try {
      join();
    } catch (error) {
      console.error("Error rejoining the meeting:", error);
      toast.error("Failed to rejoin the meeting");
    }
  };

  const handleSwitchToOtherDevice = async () => {
    setIsMultiDeviceDialogOpen(false);
    toast.info("Ending meeting on this device");

    try {
      setIsLeaving(true);
      setUserConfirmedLeave(true);

      if (isMeetingJoined) {
        await leave();
      }

      if (onMeetingLeft) {
        onMeetingLeft();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error leaving meeting:", error);
      router.push("/");
    }
  };
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
        !isLeaving
      ) {
        setUserConfirmedLeave(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMeetingJoined, isLeaving]);

  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      if (isMeetingJoined && !isLeaving) {
        leaveMeetingSafely();
      }
    };
  }, [isMeetingJoined, isLeaving]);

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
      toggleMic();
    } catch (error) {
      console.error("Error toggling mic:", error);
    }
  };

  const handleToggleVideo = () => {
    if (!isVideoEnabled) {
      toast.error("Video toggle not allowed in audio-only mode");
      return;
    }

    try {
      toggleWebcam();
    } catch (error) {
      console.error("Error toggling webcam:", error);
    }
  };

  const handleEndCall = async () => {
    if (!isProvider && !!otherParticipants.length) {
      setOpen(true);
      return;
    }

    try {
      setIsLeaving(true);
      setUserConfirmedLeave(true);

      if (isMeetingJoined) {
        await leave();
      }

      router.push("/");
    } catch (error) {
      console.error("Error ending call:", error);

      router.push("/");
    }
  };

  const getActiveParticipants = () => {
    return [...participants.values()].filter((p) =>
      ["SEND_AND_RECV", "RECV_ONLY", "SEND_ONLY"].includes(p.mode)
    );
  };

  console.log(participants);

  const activeParticipantsArray = getActiveParticipants();
    const otherParticipants = [...participants.values()].filter(
    (p) => p?.id !== localParticipant?.id
  );
  const isAloneInMeeting = !!activeParticipantsArray.length && !otherParticipants?.length;



  console.log(!!otherParticipants?.length,isAloneInMeeting, "OEJDJ");

  useEffect(() => {
    if (
      isVideoEnabled &&
      ((activeParticipantsArray[0]?.webcamOn === true &&
        otherParticipants[0]?.webcamOn === true) ||
        isAloneInMeeting)
    ) {
      setLayout("focus");
    } else {
      setLayout("grid");
    }
  }, [
    activeParticipantsArray,
    isAloneInMeeting,
    otherParticipants,
    layout,
    setLayout,
    isVideoEnabled,
  ]);

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

      <div className="flex-1 overflow-hidden relative">
        {layout === "focus" && (
          <div className="h-full flex flex-col">
            {isMobile ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {isAloneInMeeting ? (
                    localParticipant && (
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

                  {!isAloneInMeeting && localParticipant && (
                    <div className="flex flex-col p-2 gap-2 absolute top-2 right-2">
                      <div className="h-32 w-40 border-2 border-white rounded-lg overflow-hidden">
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

                  <RenderIf condition={!isAloneInMeeting && !!localParticipant}>
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

        <div className="pb-16 md:pb-20 h-full">
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
          handleEndCall={handleEndCall}
          handleToggleAudio={handleToggleAudio}
          handleToggleVideo={handleToggleVideo}
          isVideoEnabled={isVideoEnabled}
        />
      </div>
      <RatingDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          handleEndCall();
        }}
      />

      <AlertDialog
        open={isMultiDeviceDialogOpen}
        onOpenChange={setIsMultiDeviceDialogOpen}
      >
        <AlertDialogContent className="grid gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Multiple Device Connection Detected
            </AlertDialogTitle>
            <AlertDialogDescription>
              You appear to be joining this meeting from another device. Would
              you like to continue on this device or switch to the other device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex md:justify-end ">
            <AlertDialogCancel onClick={handleSwitchToOtherDevice}>
              Switch to Other Device
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStayOnCurrentDevice}>
              Continue on This Device
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default MeetingView;
