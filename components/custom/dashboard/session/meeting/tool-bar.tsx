"use client";
import React from "react";
import {
  IconMic,
  IconMicOff,
  IconVideoOff,
  IconShare2,
  IconVideo,
  IconEndCall,
  IconClock,
} from "@/components/icons";
import { cn } from "@/lib/utils";

interface ToolBarProps {
  localMicOn: boolean;
  localWebcamOn: boolean;
  isLeaving: boolean;
  handleToggleAudio: () => void;
  handleToggleVideo: () => void;
  handleEndCall: () => void;
  isVideoEnabled: boolean;
}

const Timer = () => {
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-sm md:text-lg bg-gray-100 font-semibold text-[#001933] py-1.5 px-2 border border-brand-accent-2 rounded-full flex items-center">
      <IconClock className="w-4 h-4 md:w-6 md:h-6 mr-1 stroke-brand-1" />
      {formatTime(time)}
    </div>
  );
};

const ToolBar: React.FC<ToolBarProps> = ({
  localMicOn,
  localWebcamOn,
  isLeaving,
  handleToggleAudio,
  handleToggleVideo,
  handleEndCall,
  isVideoEnabled,
}) => {
  return (
    <div className="flex absolute inset-x-0 bottom-0 justify-between w-full items-center gap-4 p-2 bg-transparent">
      <button
        className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
        aria-label="Share screen"
      >
        <IconShare2 className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
      </button>
      <div className="flex justify-center items-center gap-4 ">
        <button
          onClick={handleToggleAudio}
          className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center ${
            localMicOn
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-brand-accent-2 text-white hover:opacity-90"
          } transition-colors`}
          aria-label={localMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {localMicOn ? (
            <IconMic className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
          ) : (
            <IconMicOff className="md:w-5 w-4 md:h-5 h-4 stroke-white" />
          )}
        </button>

        <button
          onClick={handleToggleVideo}
          disabled={!isVideoEnabled}
          className={cn(
            `w-12 h-12 rounded-full cursor-pointer flex items-center justify-center ${
              !isVideoEnabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : localWebcamOn
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-brand-accent-2 text-white hover:opacity-90"
            } transition-colors`
          )}
          aria-label={localWebcamOn ? "Turn off camera" : "Turn on camera"}
        >
          {localWebcamOn ? (
            <IconVideo className="md:w-5 w-4 md:h-5 h-4 stroke-brand-1" />
          ) : (
            <IconVideoOff className={cn("md:w-5 w-4 md:h-5 h-4 stroke-white", !isVideoEnabled && 'stroke-brand-3')} />
          )}
        </button>

        <button
          onClick={handleEndCall}
          className="w-12 h-12 cursor-pointer rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
          aria-label="End call"
          disabled={isLeaving}
        >
          <IconEndCall className="md:w-5 w-4 md:h-5 h-4 stroke-white" />
        </button>
      </div>

      <Timer />
    </div>
  );
};

export default ToolBar;
