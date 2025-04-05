'use client';
import React from "react";
import ParticipantVideo from "./participant-video";
import VideoControls from "./video-controls";
import SessionTimer from "./session-timer";
import ShareModal from "./share-modal";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }: { participantId: string }) => {
  const { webcamStream, webcamOn, displayName, isLocal } = useParticipant(participantId);
  
  return (
    <ParticipantVideo
      name={displayName || (isLocal ? "You" : "Participant")}
      role={isLocal ? "You" : "Participant"}
      videoUrl={webcamOn ? "" : "/placeholder.svg"}
      isMainVideo={!isLocal}
      stream={webcamStream}
      isLocal={isLocal}
    />
  );
};

const VideoModeView = () => {
  const { 
    elapsedTime, 
    showShareModal,
    setShowShareModal
  } = useAppMeeting();
  
  const { participants } = useMeeting();
  
  return (
    <div className="video-container">
      {/* Map through participants */}
      {[...participants.keys()].map((participantId) => (
        <ParticipantView 
          key={participantId} 
          participantId={participantId} 
        />
      ))}
      
      {/* If no participants yet, show placeholder */}
      {participants.size === 0 && (
        <div className="flex items-center justify-center h-full w-full">
          <p>Waiting for participants to join...</p>
        </div>
      )}
      
      {/* Controls for the video call */}
      <VideoControls />
      
      {/* Timer for the session */}
      <SessionTimer seconds={elapsedTime} />
      
      {/* Share modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default VideoModeView;