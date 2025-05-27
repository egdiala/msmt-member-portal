"use client";

import React, { useEffect } from "react";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import VideoModeView from "./video-mode-view";
import AudioModeView from "./audio-mode-view";
import { useVideoSDKMeeting } from "@/hooks/use-videosdk";

const MeetingRoom = () => {
  const {
    isAudioMode,
    // meetingId,
    _setIsMeetingJoined,
    _setLocalParticipantId,
  } = useAppMeeting();

  const meeting = useVideoSDKMeeting({
    onMeetingJoined: () => {

      _setIsMeetingJoined(true);
    },
    onMeetingLeft: () => {
  
      _setIsMeetingJoined(false);
    },
    onParticipantJoined: (participant: any) => {
      console.log(`Participant joined: ${participant.id}`);
    },
    onParticipantLeft: (participant: any) => {
      console.log(`Participant left: ${participant.id}`);
    },
  });

  useEffect(() => {
    if (meeting && meeting.localParticipant) {
      _setLocalParticipantId(meeting.localParticipant.id);
    }
  }, [meeting, meeting?.localParticipant, _setLocalParticipantId]);

  return (
    <div className="w-full h-full min-h-[500px]">
      {isAudioMode ? <AudioModeView /> : <VideoModeView />}
    </div>
  );
};

export default MeetingRoom;
