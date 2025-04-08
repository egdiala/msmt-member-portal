"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import ParticipantInfo from "./participant-info";
import { MicOff } from "lucide-react";

interface ParticipantVideoProps {
  name: string;
  role: string;
  videoUrl?: string;
  stream?: MediaStream | null;
  isMainVideo?: boolean;
  isMuted?: boolean;
  isLocal?: boolean;
  className?: string;
}

const ParticipantVideo = ({
  name,
  role,
  videoUrl,
  stream,
  isMainVideo = false,
  isMuted = false,
  isLocal = false,
  className = "",
}: ParticipantVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Connect the media stream to the video element when available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`avatar-container ${
        isMainVideo ? "w-full h-full" : "pip-video w-1/4 max-w-[150px]"
      } ${className}`}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video to prevent echo
          className="w-full h-full object-cover"
        />
      ) : (
        videoUrl && (
          <Image
            src={videoUrl}
            fill
            alt={`${name} video`}
            className="w-full h-full object-cover"
          />
        )
      )}
      <ParticipantInfo name={name} role={role}>
        {isMuted && (
          <div className="ml-1 bg-red-500 text-white p-1 rounded-full">
            <MicOff size={12} />
          </div>
        )}
      </ParticipantInfo>
    </div>
  );
};

export default ParticipantVideo;
