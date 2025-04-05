'use client';
import React from "react";
import { Mic, MicOff, Video, VideoOff,  Phone, ScreenShare } from "lucide-react";
import { useMeeting as useAppMeeting } from "@/contexts/MeetingContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMeeting } from "@videosdk.live/react-sdk";

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
  
  const { toggleMic, toggleWebcam, leave, enableScreenShare } = useMeeting();
  const isMobile = useIsMobile();

  const handleToggleAudio = () => {
    toggleMic();
    _setIsAudioMuted(!isAudioMuted); // Update app state to reflect VideoSDK state
    toggleAudio(); // For toast notification
  };

  const handleToggleVideo = () => {
    toggleWebcam();
    _setIsVideoOff(!isVideoOff); // Update app state to reflect VideoSDK state
    toggleVideo(); // For toast notification
  };

  const handleShareScreen = () => {
    toggleScreenShare();
    enableScreenShare();
  };

  const handleLeaveCall = () => {
    leave();
    leaveMeeting();
  };

  return (
    <div className="video-controls">
      <button
        onClick={handleToggleAudio}
        className={`control-button ${isAudioMuted ? "active" : "inactive"}`}
        aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isAudioMuted ? <MicOff size={isMobile ? 18 : 24} /> : <Mic size={isMobile ? 18 : 24} />}
      </button>
      
      <button
        onClick={handleToggleVideo}
        className={`control-button ${isVideoOff ? "active" : "inactive"}`}
        aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoOff ? <VideoOff size={isMobile ? 18 : 24} /> : <Video size={isMobile ? 18 : 24} />}
      </button>
      
      <button
        onClick={handleShareScreen}
        className="control-button inactive"
        aria-label="Share screen"
      >
        <ScreenShare size={isMobile ? 18 : 24} />
      </button>
      
      <button
        onClick={handleLeaveCall}
        className="control-button active"
        aria-label="End call"
      >
        <Phone size={isMobile ? 18 : 24} />
      </button>
    </div>
  );
};

export default VideoControls;