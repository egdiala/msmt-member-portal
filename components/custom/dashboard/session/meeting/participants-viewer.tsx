"use client";

import React, { useMemo } from "react";
import useMediaStream from "@/hooks/use-media-stream";
import { MemoizedParticipantGrid } from "./participant-grid";

interface ParticipantsViewerProps {
  isPresenting: boolean;
}

function ParticipantsViewer({ isPresenting }: ParticipantsViewerProps) {
  const { videoSDK } = useMediaStream();
  const meeting = videoSDK?.useMeeting();

  if (!meeting) {
    return null; 
  }

  const {
    participants,
    pinnedParticipants,
    activeSpeakerId,
    localParticipant,
    localScreenShareOn,
    presenterId,
  } = meeting;

  const participantIds = useMemo<string[]>(() => {
    const pinnedParticipantId = [...pinnedParticipants.keys()].filter(
      (participantId) => participantId !== localParticipant.id
    );

    const regularParticipantIds = [...participants.keys()].filter(
      (participantId) => 
        !pinnedParticipants.has(participantId) && localParticipant.id !== participantId
    );

    const ids = [
      localParticipant.id,
      ...pinnedParticipantId,
      ...regularParticipantIds,
    ].slice(0, isPresenting ? 6 : 16);

    if (activeSpeakerId && !ids.includes(activeSpeakerId)) {
      ids[ids.length - 1] = activeSpeakerId;
    }
    return ids;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
    localParticipant.id,
    isPresenting,
  ]);

  return (
    <MemoizedParticipantGrid
      participantIds={participantIds}
      isPresenting={isPresenting}
    />
  );
}

const MemorizedParticipantView = React.memo(
  ParticipantsViewer,
  (prevProps: ParticipantsViewerProps, nextProps: ParticipantsViewerProps) => {
    return prevProps.isPresenting === nextProps.isPresenting;
  }
);

export default MemorizedParticipantView;
