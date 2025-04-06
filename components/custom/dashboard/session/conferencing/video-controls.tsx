"use client";

import React from "react";
import { Mic, MicOff, Video, VideoOff, ScreenShare, Phone } from "lucide-react";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideoSDKMeeting } from "@/hooks/use-videosdk";

const VideoControls = () => {
  const { 
    isAudioMuted, 
    isVideoOff, 
    toggleAudio, 
    toggleVideo, 
    toggleScreenShare, 
    leaveMeeting, 
    _setIsAudioMuted,
    _setIsVideoOff
  } = useAppMeeting();
  
  const meeting = useVideoSDKMeeting();
  const isMobile = useIsMobile();

  const handleToggleAudio = () => {
    if (meeting && meeting.toggleMic) {
      meeting.toggleMic();
    }
    _setIsAudioMuted(!isAudioMuted); // Update app state to reflect VideoSDK state
    toggleAudio(); // For toast notification
  };

  const handleToggleVideo = () => {
    if (meeting && meeting.toggleWebcam) {
      meeting.toggleWebcam();
    }
    _setIsVideoOff(!isVideoOff); // Update app state to reflect VideoSDK state
    toggleVideo(); // For toast notification
  };

  const handleShareScreen = () => {
    toggleScreenShare();
    if (meeting && meeting.enableScreenShare) {
      meeting.enableScreenShare();
    }
  };

  const handleLeaveCall = () => {
    if (meeting && meeting.leave) {
      meeting.leave();
    }
    leaveMeeting();
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 rounded-full p-2">
      <button
        onClick={handleToggleAudio}
        className={`p-3 rounded-full ${isAudioMuted ? "bg-red-500" : "bg-gray-700"} text-white hover:opacity-80 transition-all`}
        aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isAudioMuted ? <MicOff size={isMobile ? 18 : 24} /> : <Mic size={isMobile ? 18 : 24} />}
      </button>
      
      <button
        onClick={handleToggleVideo}
        className={`p-3 rounded-full ${isVideoOff ? "bg-red-500" : "bg-gray-700"} text-white hover:opacity-80 transition-all`}
        aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoOff ? <VideoOff size={isMobile ? 18 : 24} /> : <Video size={isMobile ? 18 : 24} />}
      </button>
      
      <button
        onClick={handleShareScreen}
        className="p-3 rounded-full bg-gray-700 text-white hover:opacity-80 transition-all"
        aria-label="Share screen"
      >
        <ScreenShare size={isMobile ? 18 : 24} />
      </button>
      
      <button
        onClick={handleLeaveCall}
        className="p-3 rounded-full bg-red-500 text-white hover:opacity-80 transition-all"
        aria-label="End call"
      >
        <Phone size={isMobile ? 18 : 24} />
      </button>
    </div>
  );
};

export default VideoControls;