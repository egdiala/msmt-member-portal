"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import {
  IconMic,
  IconMicOff,
  IconVideoOff,
  IconShare2,
  IconVideo,
  IconEndCall,
} from "@/components/icons";

interface MeetingViewProps {
  initialAudioEnabled: boolean;
  initialVideoEnabled: boolean;
}

const Timer = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-sm font-medium text-gray-700 flex items-center">
      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
      {formatTime(time)}
    </div>
  );
};

interface MeetingViewProps {
  initialAudioEnabled: boolean;
  initialVideoEnabled: boolean;
  isProvider?: boolean;
}

const MeetingView: React.FC<MeetingViewProps> = ({
  initialAudioEnabled,
  initialVideoEnabled,
  isProvider = false,
}) => {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(initialAudioEnabled);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(initialVideoEnabled);
  const [layout, setLayout] = useState<'grid' | 'focus'>('focus');
  
  const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined successfully");
    },
    onMeetingLeft: () => {
      console.log("Meeting left");
    },
    onError: (error) => {
      console.log("Error in meeting:", error);
    },
  });

  useEffect(() => {
    join();

    if (!initialAudioEnabled) {
      toggleMic();
    }

    if (!initialVideoEnabled) {
      toggleWebcam();
    }

    return () => {
      leave();
    };
  }, []);

  const handleToggleAudio = () => {
    toggleMic();
    setAudioEnabled(!audioEnabled);
  };

  const handleToggleVideo = () => {
    toggleWebcam();
    setVideoEnabled(!videoEnabled);
  };

  const handleEndCall = () => {
    leave();
    // Redirect to post-call page
    window.location.href = '/call-ended';
  };

  const handleToggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'focus' : 'grid');
  };

  // Get array of participants
  const participantsArray = [...participants.values()];
  
  // For focus layout, determine which participant to focus on
  const focusParticipant = isProvider 
    ? participantsArray.find(p => p.id !== 'local') || participantsArray[0]
    : participantsArray.find(p => p.id === 'local') || participantsArray[0];
  
  const otherParticipants = participantsArray.filter(p => p.id !== focusParticipant?.id);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Meeting header */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="flex items-center space-x-2">
          {isProvider ? 
            <span className="text-blue-600 font-semibold">Patient Session</span> :
            <span className="text-blue-600 font-semibold">Provider Session</span>
          }
          <Timer />
        </div>
        <button 
          onClick={handleToggleLayout}
          className="text-gray-600 hover:text-gray-800"
        >
          {layout === 'grid' ? 'Focus View' : 'Grid View'}
        </button>
      </div>

      {/* Meeting content */}
      <div className="flex-1 bg-gray-100 overflow-hidden relative">
        {layout === 'focus' ? (
          <div className="h-full flex flex-col">
            {/* Main large video */}
            <div className="flex-1 relative">
              {focusParticipant && (
                <ParticipantView
                  key={focusParticipant.id}
                  participantId={focusParticipant.id}
                  large={true}
                />
              )}
            </div>
            
            {/* Thumbnail row at bottom */}
            <div className="h-24 flex gap-2 p-2 bg-gray-200">
              {otherParticipants.map(participant => (
                <div key={participant.id} className="h-full aspect-video">
                  <ParticipantView
                    participantId={participant.id}
                    large={false}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-full">
            {participantsArray.map(participant => (
              <ParticipantView
                key={participant.id}
                participantId={participant.id}
                large={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 p-3 bg-white border-t">
        <button
          onClick={handleToggleAudio}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            audioEnabled ? 'bg-gray-200 text-gray-800' : 'bg-red-100 text-red-600'
          }`}
          aria-label={audioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {audioEnabled ? <IconMic /> : <IconMicOff />}
        </button>
        
        <button
          onClick={handleToggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            videoEnabled ? 'bg-gray-200 text-gray-800' : 'bg-red-100 text-red-600'
          }`}
          aria-label={videoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {videoEnabled ? <IconVideo /> : <IconVideoOff />}
        </button>
        
        <button
          onClick={handleEndCall}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 text-white"
          aria-label="End call"
        >
          <IconEndCall />
        </button>
        
        {/* <button
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-800"
          aria-label="Chat"
        >
          <IconChat />
        </button> */}
        
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-800"
          aria-label="Share screen"
        >
          <IconShare2 />
        </button>
      </div>
    </div>
  );
};

// Individual participant view component
interface ParticipantViewProps {
  participantId: string;
  large?: boolean;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ 
  participantId,
  large = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, displayName, isLocal } = useParticipant(participantId);

  useEffect(() => {
    if (webcamOn && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream, webcamOn]);

  const name = displayName || (isLocal ? "You" : "User");
  const role = name === "You" ? "You" : (name.includes("Provider") ? "Provider" : "Patient");
  

  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className={`relative rounded-lg overflow-hidden ${large ? 'h-full w-full' : 'h-full w-full'} bg-gray-800`}>
      {webcamOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-700 text-white">
          <div className="w-20 h-20 flex items-center justify-center bg-blue-600 rounded-full text-3xl font-medium">
            {firstLetter}
          </div>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
        <span>{name}</span>
        {!micOn && (
          <span className="ml-2 text-red-500">
            <IconMicOff />
          </span>
        )}
      </div>
      
      {/* Role tag in top left */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
        {role}
      </div>
    </div>
  );
};

export default MeetingView;
export { ParticipantView };