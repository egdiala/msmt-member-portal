'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { IconMic, IconMicOff, IconVideoOff, IconVideo, IconEndCall } from '@/components/icons';


interface MeetingViewProps {
  initialAudioEnabled: boolean;
  initialVideoEnabled: boolean;
}


const MeetingView: React.FC<MeetingViewProps> = ({ initialAudioEnabled, initialVideoEnabled }) => {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(initialAudioEnabled);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(initialVideoEnabled);

  const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting({
    onMeetingJoined: () => {
      console.log("Meeting joined successfully");
    },
    onMeetingLeft: () => {
      console.log("Meeting left");
    },
    onError: (error) => {
      console.log("Error in meeting:", error);
    }
  });

  useEffect(() => {
    // Join the meeting when component mounts
    join();

    // Set initial audio and video state based on backend settings
    if (!initialAudioEnabled) {
      toggleMic();
    }
    
    if (!initialVideoEnabled) {
      toggleWebcam();
    }

    // Clean up when component unmounts
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
    // You might want to redirect the user after ending the call
    // window.location.href = '/call-ended';
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2 flex-1 overflow-y-auto">
        {[...participants.values()].map((participant) => (
          <ParticipantView key={participant.id} participantId={participant.id} />
        ))}
      </div>

      <div className="flex justify-center gap-4 p-4 bg-white">
        <button 
          onClick={handleToggleAudio} 
          className="w-12 h-12 rounded-full border-none flex items-center justify-center text-lg cursor-pointer bg-gray-200 text-gray-800"
        >
          {audioEnabled ? <IconMic /> : <IconMicOff />}
        </button>
        <button 
          onClick={handleToggleVideo} 
          className="w-12 h-12 rounded-full border-none flex items-center justify-center text-lg cursor-pointer bg-gray-200 text-gray-800"
        >
          {videoEnabled ? <IconVideo /> : <IconVideoOff />}
        </button>
        <button 
          onClick={handleEndCall} 
          className="w-12 h-12 rounded-full border-none flex items-center justify-center text-lg cursor-pointer bg-red-500 text-white"
        >
          <IconEndCall />
        </button>
      </div>
    </div>
  );
};

// Individual participant view
interface ParticipantViewProps {
  participantId: string;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, displayName } = useParticipant(participantId);

  useEffect(() => {
    if (webcamOn && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      {webcamOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participantId === "local"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-700 text-white text-2xl">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded-full">
            {displayName ? displayName.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between">
        <span>{displayName || "User"}</span>
        {!micOn && <IconEndCall className="text-red-500 ml-2" />}
      </div>
    </div>
  );
};

export default MeetingView;
export { ParticipantView };