"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useParticipant } from "@videosdk.live/react-sdk";
import { IconMic, IconMicOff } from "@/components/icons";
import { cn } from "@/lib/utils";

interface Stream {
  track: MediaStreamTrack;
}

interface ParticipantData {
  displayName: string;
  webcamStream: Stream | null;
  micStream: Stream | null;
  webcamOn: boolean;
  micOn: boolean;
  isLocal: boolean;
  metaData?: {
    name?: string;
    avatar?: string;
    [key: string]: any;
  };
}

const ParticipantView = ({
  participantId,
  large = false,
}: {
  participantId: string;
  large: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    displayName,
    isLocal,
    metaData,
  } = useParticipant(participantId) as unknown as ParticipantData;

  const name = isLocal ? metaData?.name || "You" : displayName;

  // Setup Video
  useEffect(() => {
    const videoElement = videoRef.current;

    if (webcamStream?.track && videoElement) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoElement.srcObject = mediaStream;
      videoElement
        .play()
        .catch((e) => console.error("Video play error:", e));
    }
  }, [webcamStream?.track]);

  // Setup Audio (Only for remote)
  useEffect(() => {
    const audioElement = audioRef.current;

    if (!isLocal && micStream?.track && audioElement) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      audioElement.srcObject = mediaStream;
      audioElement
        .play()
        .catch((e) => console.error("Audio play error:", e));
    }
  }, [micStream?.track, isLocal]);

  return (
    <div className={`rounded-lg overflow-hidden ${large ? "h-full w-full" : "h-full w-full"}`}>
      {webcamOn && webcamStream ? (
        <div className="h-full w-full rounded-lg relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className={cn(
              large
                ? "object-cover md:object-contain md:aspect-video"
                : "object-cover",
              "object-center z-1 rounded-lg w-full h-full"
            )}
          />
          <div className="absolute bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center shadow-sm">
            <span>{name}</span>
            <span className="ml-2 text-red-500">
              {!micOn ? (
                <IconMicOff className="w-4 h-4 stroke-red-500" />
              ) : (
                <IconMic className="w-4 h-4 stroke-brand-1" />
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-blue-400 text-white">
          <div
            className={cn(
              audioRef && micOn && "p-2 rounded-2xl overflow-hidden ring-4 ring-brand-accent-2 ring-opacity-60"
            )}
          >
            <div className="h-40 w-40 md:h-52 md:w-52 rounded-2xl relative">
              <Image
                src={metaData?.avatar || "/assets/blank-profile-picture.png"}
                alt={name}
                width={208}
                height={208}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 md:bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center shadow-sm">
                <span>{name}</span>
                <span className="ml-2 text-red-500">
                  {!micOn ? (
                    <IconMicOff className="w-4 h-4 stroke-red-500" />
                  ) : (
                    <IconMic className="w-4 h-4 stroke-brand-1" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLocal && micOn && <audio ref={audioRef} autoPlay />}
    </div>
  );
};

export { ParticipantView };
