"use client";
import React from "react";
import ParticipantVideo from "./participant-video";
import VideoControls from "./video-controls";
import SessionTimer from "./session-timer";
import ShareModal from "./share-modal";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useVideoSDKMeeting,
  useVideoSDKParticipant,
} from "@/hooks/use-videosdk";

const ParticipantView = ({ participantId }: { participantId: string }) => {
  const participant = useVideoSDKParticipant(participantId);

  return (
    <ParticipantVideo
      name={
        participant.displayName || (participant.isLocal ? "You" : "Participant")
      }
      role={participant.isLocal ? "You" : "Participant"}
      videoUrl={participant.webcamOn ? "" : "/placeholder.svg"}
      isMainVideo={!participant.isLocal}
      stream={participant.webcamStream as unknown as MediaStream}
      isLocal={participant.isLocal}
    />
  );
};

const VideoModeView = () => {
  const { elapsedTime, showShareModal, setShowShareModal } = useAppMeeting();

  const meeting = useVideoSDKMeeting();

  return (
    <div className="video-container">
      {/* Map through participants */}
      {meeting &&
        meeting.participants &&
        [...meeting.participants.keys()].map((participantId) => (
          <ParticipantView key={participantId} participantId={participantId} />
        ))}

      {(!meeting ||
        !meeting.participants ||
        meeting.participants.size === 0) && (
        <div className="flex items-center justify-center h-full w-full">
          <p>Waiting for participants to join...</p>
        </div>
      )}

      <VideoControls />

      <SessionTimer seconds={elapsedTime} />
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default VideoModeView;
