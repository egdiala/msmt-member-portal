"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useParticipant } from "@videosdk.live/react-sdk";
import { IconMic, IconMicOff } from "@/components/icons";
import { cn } from "@/lib/utils";

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
  } = useParticipant(participantId);

  const name = isLocal ? metaData?.name || displayName || "You" : displayName;

  const role = isLocal ? "You" : name;

  useEffect(() => {
    if (audioRef.current) {
      if (micStream && micOn) {
        try {
          const mediaStream = new MediaStream();

          if (micStream.track instanceof MediaStreamTrack) {
            mediaStream.addTrack(micStream.track);

            // Always set a fresh srcObject
            audioRef.current.srcObject = mediaStream;

            audioRef.current.play().catch((error) => {
              if (error.name !== "AbortError") {
                console.error("Error playing audio:", error);
              }
            });
          }
        } catch (error) {
          console.error("Error setting up audio stream:", error);
        }
      } else {
        if (audioRef.current.srcObject) {
          const mediaStream = audioRef.current.srcObject as MediaStream;
          mediaStream.getTracks().forEach((track) => track.stop());
          audioRef.current.srcObject = null;
        }
      }
    }


    return () => {
      if (audioRef.current && audioRef.current.srcObject) {
        const mediaStream = audioRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
        audioRef.current.srcObject = null;
      }
    };
  }, [micStream, micOn, participantId]);

  useEffect(() => {
    if (videoRef.current) {
      if (webcamStream && webcamOn) {
        try {
          // Create a new MediaStream for each new video track
          const mediaStream = new MediaStream();

          if (webcamStream.track instanceof MediaStreamTrack) {
            mediaStream.addTrack(webcamStream.track);

            // Always set a fresh srcObject
            videoRef.current.srcObject = mediaStream;

            videoRef.current.play().catch((error) => {
              if (error.name !== "AbortError") {
                console.error("Error playing video:", error);
              }
            });
          }
        } catch (error) {
          console.error("Error setting up video stream:", error);
        }
      } else {
 
        if (videoRef.current.srcObject) {
          const mediaStream = videoRef.current.srcObject as MediaStream;
          mediaStream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const mediaStream = videoRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [webcamStream, webcamOn, participantId]);

  return (
    <div
      className={`rounded-lg overflow-hidden ${
        large ? "h-full w-full" : "h-full w-full"
      }`}
    >
      {webcamOn ? (
        <div className="full h-full relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center">
            <span>{role}</span>

            <span className="ml-2 text-red-500">
              {!micOn && <IconMicOff className="w-4 h-4 stroke-red-500" />}
              {micOn && <IconMic className="w-4 h-4 stroke-brand-1" />}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-blue-400 text-white">
          <div className={cn(audioRef && micOn && "p-2  rounded-2xl overflow-hidden ring-4 ring-brand-accent-2 ring-opacity-60")}>
            <div className="h-52 w-52 rounded-2xl relative">
              <Image
                src={metaData?.avatar || "/assets/user.png"}
                alt={name}
                width={208}
                height={208}
                className="w-full h-full object-cover rounded-2xl"
              />

              <div className="absolute bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center">
                <span>{role}</span>

                <span className="ml-2 text-red-500">
                  {!micOn && <IconMicOff className="w-4 h-4 stroke-red-500" />}
                  {micOn && <IconMic className="w-4 h-4 stroke-brand-1" />}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {micOn && !isLocal && <audio ref={audioRef} autoPlay />}
    </div>
  );
};

export { ParticipantView };
