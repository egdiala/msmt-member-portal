'use client'
import React, { useEffect } from "react";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import VideoModeView from "./video-mode-view";
import AudioModeView from "./audio-mode-view";
import { useMeeting} from "@videosdk.live/react-sdk";

const MeetingRoom = () => {
  const { 
    isAudioMode, 
    meetingId, 
    _setIsMeetingJoined, 
    _setLocalParticipantId
  } = useAppMeeting();
  
  // Use VideoSDK's meeting hook to access meeting state and methods
  const meeting = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined via VideoSDK");
      _setIsMeetingJoined(true);
    },
    onMeetingLeft: () => {
      console.log("Meeting left via VideoSDK");
      _setIsMeetingJoined(false);
    },
    onParticipantJoined: (participant) => {
      console.log(`Participant joined: ${participant.id}`);
    },
    onParticipantLeft: (participant) => {
      console.log(`Participant left: ${participant.id}`);
    }
  });
  
  // Set local participant ID when available
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