"use client";
import React, { useEffect, useRef } from "react";

import { useParticipant } from "@videosdk.live/react-sdk";
import { IconMic, IconMicOff } from "@/components/icons";

const ParticipantView = ({
  participantId,
  large = false,
  isProvider,
}: {
  participantId: string;
  large: boolean;
  isProvider: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { webcamStream, micStream, webcamOn, micOn, displayName, isLocal } =
    useParticipant(participantId);

  // Get participant name from various sources
  const meetingProviderData =
    typeof document !== "undefined"
      ? document
          .querySelector("[data-participant-name]")
          ?.getAttribute("data-participant-name")
      : null;
  const storedName =
    typeof window !== "undefined"
      ? window.localStorage.getItem("videosdk-participant-name")
      : null;

  const name = isLocal
    ? storedName || meetingProviderData || displayName || "You"
    : displayName;

  const role = isLocal ? "You" : name;
  const firstLetter = (name?.charAt(0) || "?").toUpperCase();

  useEffect(() => {
    if (audioRef.current) {
      if (micStream && micOn) {
        try {
          // Create a new MediaStream for each new audio track
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
        // Clean up when mic is turned off
        if (audioRef.current.srcObject) {
          const mediaStream = audioRef.current.srcObject as MediaStream;
          mediaStream.getTracks().forEach((track) => track.stop());
          audioRef.current.srcObject = null;
        }
      }
    }

    // Clean up function
    return () => {
      if (audioRef.current && audioRef.current.srcObject) {
        const mediaStream = audioRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
        audioRef.current.srcObject = null;
      }
    };
  }, [micStream, micOn, participantId]);

  // Handle webcam video stream
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
        // Clean up when webcam is turned off
        if (videoRef.current.srcObject) {
          const mediaStream = videoRef.current.srcObject as MediaStream;
          mediaStream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    }

    // Clean up function
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
      className={`relative rounded-lg overflow-hidden ${
        large ? "h-full w-full" : "h-full w-full"
      }`}
    >
      {webcamOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-blue-400 text-white">
          <div className="w-20 h-20 flex items-center justify-center bg-brand-accent-2 rounded-full text-3xl font-medium">
            {firstLetter}
          </div>
        </div>
      )}

      {micOn && !isLocal && <audio ref={audioRef} autoPlay />}

      {/* Participant info overlay */}
      <div className="absolute bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center">
        <span>{role}</span>

        <span className="ml-2 text-red-500">
          {!micOn && <IconMicOff className="w-4 h-4 stroke-red-500" />}
          {micOn && <IconMic className="w-4 h-4 stroke-brand-1" />}
        </span>
      </div>
    </div>
  );
};

export { ParticipantView };
