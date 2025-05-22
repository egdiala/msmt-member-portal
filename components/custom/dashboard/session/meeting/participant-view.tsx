"use client";
import React, { useEffect, useRef, useCallback } from "react";
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
  const currentVideoStream = useRef<MediaStream | null>(null);
  const currentAudioStream = useRef<MediaStream | null>(null);
  const isCleaningUp = useRef(false);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    displayName,
    isLocal,
    metaData,
  } = useParticipant(participantId) as unknown as ParticipantData;

  const name = isLocal ? metaData?.name || displayName || "You" : displayName;
  const role = isLocal ? "You" : name;

  const cleanupStreams = useCallback(() => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    if (!isLocal) {
      if (currentVideoStream.current) {
        currentVideoStream.current.getTracks().forEach((track) => {
          track.stop();
        });
        currentVideoStream.current = null;
      }

      if (currentAudioStream.current) {
        currentAudioStream.current.getTracks().forEach((track) => {
          track.stop();
        });
        currentAudioStream.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const mediaStream = videoRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      if (audioRef.current && audioRef.current.srcObject) {
        const mediaStream = audioRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
        audioRef.current.srcObject = null;
      }
    }

    isCleaningUp.current = false;
  }, [isLocal]);
  // Audio stream handling
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || isCleaningUp.current) return;

    const setupAudioStream = async () => {
      try {
        // Clean up previous audio stream only
        if (currentAudioStream.current) {
          currentAudioStream.current
            .getTracks()
            .forEach((track) => track.stop());
          audioElement.srcObject = null;
          currentAudioStream.current = null;
        }

        if (micStream && micOn && micStream.track instanceof MediaStreamTrack) {
          // Check if track is still active
          if (micStream.track.readyState === "ended") {
            console.warn("Audio track is ended, skipping setup");
            return;
          }

          const mediaStream = new MediaStream();
          mediaStream.addTrack(micStream.track);

          currentAudioStream.current = mediaStream;
          audioElement.srcObject = mediaStream;

          try {
            await audioElement.play();
          } catch (error: any) {
            if (
              error.name !== "AbortError" &&
              error.name !== "NotAllowedError"
            ) {
              console.error("Error playing audio:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error setting up audio stream:", error);
      }
    };

    const timeoutId = setTimeout(setupAudioStream, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [micStream, micOn, participantId]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isCleaningUp.current) return;

    const setupVideoStream = async () => {
      try {
        if (currentVideoStream.current) {
          currentVideoStream.current
            .getTracks()
            .forEach((track) => track.stop());
          videoElement.srcObject = null;
          currentVideoStream.current = null;
        }

        if (
          webcamStream &&
          webcamOn &&
          webcamStream.track instanceof MediaStreamTrack
        ) {
          if (webcamStream.track.readyState === "ended") {
            console.warn("Video track is ended, skipping setup");
            return;
          }

          const mediaStream = new MediaStream();
          mediaStream.addTrack(webcamStream.track);

          currentVideoStream.current = mediaStream;
          videoElement.srcObject = mediaStream;

          try {
            await videoElement.play();
          } catch (error: any) {
            if (
              error.name !== "AbortError" &&
              error.name !== "NotAllowedError"
            ) {
              console.error("Error playing video:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error setting up video stream:", error);
      }
    };

    const timeoutId = setTimeout(setupVideoStream, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [webcamStream, webcamOn, participantId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupStreams();
    };
  }, [cleanupStreams]);

  return (
    <div
      className={`rounded-lg overflow-hidden ${
        large ? "h-full w-full" : "h-full w-full"
      }`}
    >
      {webcamOn && !!currentVideoStream ? (
        <div className=" h-full w-full rounded-lg relative ">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              large
                ? "object-cover  md:object-contain md:aspect-video "
                : "object-cover ",
              " object-center z-1  rounded-lg w-full h-full"
            )}
          />
          <div className="absolute bottom-2 left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center shadow-sm">
            <span>{role}</span>
            <span className="ml-2 text-red-500">
              {!micOn && <IconMicOff className="w-4 h-4 stroke-red-500" />}
              {micOn && <IconMic className="w-4 h-4 stroke-brand-1" />}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-blue-400 text-white">
          <div
            className={cn(
              audioRef &&
                micOn &&
                "p-2 rounded-2xl overflow-hidden ring-4 ring-brand-accent-2 ring-opacity-60"
            )}
          >
            <div className="h-40 w-40 md:h-52 md:w-52 rounded-2xl relative">
              <Image
                src={metaData?.avatar || "/assets/blank-profile-picture.png"}
                alt={name}
                width={208}
                height={208}
                className="w-full h-full object-cover rounded-2xl"
                priority={large}
              />
              <div className="absolute bottom-4 md:bottom-2  left-2 bg-blue-400 bg-opacity-50 text-[#354959] px-1 py-0.5 rounded-full text-sm flex items-center shadow-sm">
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
