"use client";
import React from "react";
import ParticipantAvatar from "./participant-avatar";
import VideoControls from "./video-controls";
import SessionTimer from "./session-timer";
import ShareModal from "./share-modal";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useVideoSDKMeeting,
  useVideoSDKParticipant,
} from "@/hooks/use-videosdk";

const ParticipantAvatarWithData = ({
  participantId,
}: {
  participantId: string;
}) => {
  const participant = useVideoSDKParticipant(participantId);

  return (
    <ParticipantAvatar
      name={
        participant.displayName || (participant.isLocal ? "You" : "Participant")
      }
      role={participant.isLocal ? "Patient" : "Provider"}
      imageUrl={
        participant.isLocal
          ? "/lovable-uploads/bd72e9bc-8b79-4cc0-8e94-c8a5697f8443.png"
          : "/lovable-uploads/c169e0cf-e630-421c-bd1e-9e6e5c0a81a0.png"
      }
      isMuted={!participant.micOn}
      isYou={participant.isLocal}
      isSpeaking={participant.micOn}
      className="w-full aspect-square max-w-[250px] mx-auto"
    />
  );
};

const AudioModeView = () => {
  const { elapsedTime, showShareModal, setShowShareModal } = useAppMeeting();
  const meeting = useVideoSDKMeeting();
  const isMobile = useIsMobile();

  console.log(meeting)

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-200">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-slate-700">AUDIO SESSION</h1>
      </div>

      <div
        className={`grid ${
          isMobile ? "grid-cols-1" : "grid-cols-2"
        } gap-6 p-4 bg-white rounded-lg shadow-md max-w-2xl w-full`}
      >
        {/* Map through participants */}
        {
          meeting.participants &&
          [...meeting.participants.keys()].map((participantId) => (
            <ParticipantAvatarWithData
              key={participantId}
              participantId={participantId}
            />
          ))}

        {/* If no participants yet, show placeholder */}
        {/* {(!meeting ||
          !meeting.participants ||
          meeting.participants.size === 0) && (
          <div className="col-span-2 text-center p-4">
            <p>Waiting for participants to join...</p>
          </div>
        )} */}
      </div>

      <div className="mt-8 relative w-full">
        <VideoControls />
        <SessionTimer
          seconds={elapsedTime}
          className="absolute bottom-4 right-4"
        />
      </div>

      {/* Share modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default AudioModeView;
