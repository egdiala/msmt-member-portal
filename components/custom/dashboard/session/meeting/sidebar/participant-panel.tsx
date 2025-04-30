"use client";

import useMediaStream from "@/hooks/use-media-stream";
import React, { useMemo } from "react";
import MicOffIcon from "../../icons/ParticipantTabPanel/MicOffIcon";
import MicOnIcon from "../../icons/ParticipantTabPanel/MicOnIcon";
import RaiseHand from "../../icons/ParticipantTabPanel/RaiseHand";
import VideoCamOffIcon from "../../icons/ParticipantTabPanel/VideoCamOffIcon";
import VideoCamOnIcon from "../../icons/ParticipantTabPanel/VideoCamOnIcon";
import { useMeetingAppContext } from "@/contexts/meeting-app-context-def";
import { nameTructed } from "@/lib/utils";

interface ParticipantListItemProps {
  participantId: string;
  raisedHand: boolean;
}

function ParticipantListItem({
  participantId,
  raisedHand,
}: ParticipantListItemProps) {
  const { videoSDK } = useMediaStream();
  const useParticipant = videoSDK?.useParticipant;
  const { micOn, webcamOn, displayName, isLocal } =
    useParticipant?.(participantId)!;

  return (
    <div className="mt-2 m-2 p-2 bg-gray-700 rounded-lg mb-0">
      <div className="flex flex-1 items-center justify-center relative">
        <div
          style={{
            color: "#212032",
            backgroundColor: "#757575",
          }}
          className="h-10 w-10 text-lg mt-0 rounded overflow-hidden flex relative items-center justify-center"
        >
          {displayName?.charAt(0).toUpperCase()}
        </div>
        <div className="ml-2 mr-1 flex flex-1">
          <p className="text-base text-white overflow-hidden whitespace-pre-wrap overflow-ellipsis">
            {isLocal ? "You" : nameTructed(displayName || "", 15)}
          </p>
        </div>
        {raisedHand && (
          <div className="flex items-center justify-center m-1 p-1">
            <RaiseHand fillcolor="#fff" />
          </div>
        )}
        <div className="m-1 p-1">{micOn ? <MicOnIcon /> : <MicOffIcon />}</div>
        <div className="m-1 p-1">
          {webcamOn ? <VideoCamOnIcon /> : <VideoCamOffIcon />}
        </div>
      </div>
    </div>
  );
}

interface ParticipantPanelProps {
  panelHeight: number;
}

interface RaisedHandParticipant {
  participantId: string;
  raisedHandOn: number;
}

interface ParticipantItem {
  raisedHand: boolean;
  participantId: string;
}

export function ParticipantPanel({ panelHeight }: ParticipantPanelProps) {
  const { raisedHandsParticipants } = useMeetingAppContext();
  const { videoSDK } = useMediaStream();
  const mMeeting = videoSDK?.useMeeting();
  const participants = mMeeting?.participants!;

  const sortedRaisedHandsParticipants = useMemo<ParticipantItem[]>(() => {
    const participantIds = [...participants.keys()];

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          ({ participantId: rPID }: { participantId: string }) => rPID === pID
        ) === -1
    );

    const raisedSorted = [...raisedHandsParticipants].sort((a, b) => {
      if (a.raisedHandOn > b.raisedHandOn) return -1;
      if (a.raisedHandOn < b.raisedHandOn) return 1;
      return 0;
    });

    const combined: ParticipantItem[] = [
      ...raisedSorted.map(({ participantId }) => ({
        raisedHand: true,
        participantId,
      })),
      ...notRaised.map((participantId) => ({
        raisedHand: false,
        participantId,
      })),
    ];

    return combined;
  }, [raisedHandsParticipants, participants]);

  const filterParticipants = (
    participants: ParticipantItem[]
  ): ParticipantItem[] => participants;

  const part = useMemo(
    () => filterParticipants(sortedRaisedHandsParticipants),
    [sortedRaisedHandsParticipants]
  );

  return (
    <div
      className="flex w-full flex-col bg-gray-750 overflow-y-auto"
      style={{ height: panelHeight }}
    >
      <div
        className="flex flex-col flex-1"
        style={{ height: panelHeight - 100 }}
      >
        {[...participants.keys()].map((participantId, index) => {
          const { raisedHand, participantId: peerId } = part[index] || {
            raisedHand: false,
            participantId,
          };
          return (
            <ParticipantListItem
              key={participantId}
              participantId={peerId}
              raisedHand={raisedHand}
            />
          );
        })}
      </div>
    </div>
  );
}
