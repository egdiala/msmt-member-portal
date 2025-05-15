"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMeeting } from "@videosdk.live/react-sdk";
import { IconUsers } from "@/components/icons";
import { ParticipantView } from "./participant-view";
import { RenderIf } from "@/components/shared";
import ToolBar from "./tool-bar";
import { RatingDialog } from "../../appointments/rating-form";

interface MeetingViewProps {
  isProvider?: boolean;
  meetingId: string;
  onMeetingLeft?: () => void;
}

const MeetingView: React.FC<MeetingViewProps> = ({
  meetingId,
  onMeetingLeft,
}) => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const [layout, setLayout] = useState<"grid" | "focus">("focus");
  const [isMeetingJoined, setIsMeetingJoined] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const meetingInitializedRef = useRef(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);
  const router = useRouter();

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
    onError: (error) => {
      console.error("Error in meeting:", error);
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isMeetingJoined && !isLeaving) {
        try {
          leave();
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
          router.push("/home");
        }, 300);
      }
    } catch (error) {
      console.error("Error ending call:", error);
      router.push("/home");
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
  console.log("Active participants:", activeParticipantsArray);
  const isAloneInMeeting = activeParticipantsArray.length <= 1;

  const otherParticipants = activeParticipantsArray.filter(
    (p) => p?.id !== user_id
  );

  console.log(otherParticipants, "OTHER");

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden">
      {/* Meeting header */}
      <div className="flex justify-between items-center py-2">
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
                  {isAloneInMeeting ? (
                    localParticipant && (
                      <ParticipantView
                        participantId={localParticipant.id}
                        large={true}
                      />
                    )
                  ) : otherParticipants?.[1] ? (
                    <ParticipantView
                      participantId={otherParticipants[0]?.id}
                      large={true}
                    />
                  ) : null}

                  {!isAloneInMeeting && localParticipant && (
                    <div className="flex flex-col p-2 gap-2 absolute top-2 right-2">
                      <div className="h-32 w-40 border-2 border-white rounded-lg overflow-hidden">
                        <ParticipantView
                          key={localParticipant.id}
                          participantId={localParticipant.id}
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
                        participantId={localParticipant.id}
                        large={true}
                      />
                    )
                  ) : otherParticipants.length > 0 ? (
                    <ParticipantView
                      participantId={otherParticipants[0]?.id}
                      large={true}
                    />
                  ) : null}

                  <RenderIf condition={!isAloneInMeeting && !!localParticipant}>
                    <div className="h-48 flex w-52 absolute top-2 right-2">
                      <div className="h-full w-full border-2 rounded-lg overflow-hidden border-white">
                        <ParticipantView
                          key={localParticipant.id}
                          participantId={localParticipant.id}
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
        />
      </div>
      {/* <RatingDialog
        open={open}
        onOpenChange={setOpen}
        personName={data?.provider_data?.name}
      /> */}
    </div>
  );
};
export default MeetingView;
