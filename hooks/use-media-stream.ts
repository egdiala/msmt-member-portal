"use client";

import { useState, useEffect, useCallback } from "react";

type EncoderConfig =
  | "h540p_w960p"
  | "h90p_w160p"
  | "h180p_w320p"
  | "h216p_w384p"
  | "h360p_w640p"
  | "h720p_w1280p"
  | "h1080p_w1920p"
  | "h1440p_w2560p"
  | "h2160p_w3840p"
  | "h120p_w160p"
  | "h180p_w240p"
  | "h360p_w480p"
  | "h540p_w720p"
  | "h720p_w960p"
  | "h1080p_w1440p";

interface GetVideoTrackOptions {
  webcamId?: string;
  encoderConfig?: EncoderConfig;
}

interface GetAudioTrackOptions {
  micId?: string;
}

type VideoSDKType = typeof import("@videosdk.live/react-sdk");

const useMediaStream = () => {
  const [videoSDK, setVideoSDK] = useState<VideoSDKType | null>(null);

  useEffect(() => {
    const importVideoSDK = async () => {
      try {
        const sdk = await import("@videosdk.live/react-sdk");
        setVideoSDK(sdk);
      } catch (error) {
        console.error("Failed to import VideoSDK:", error);
      }
    };

    importVideoSDK();
  }, []);

  const getVideoTrack = useCallback(
    async ({ webcamId, encoderConfig }: GetVideoTrackOptions) => {
      if (!videoSDK?.createCameraVideoTrack) {
        console.error("VideoSDK not loaded yet.");
        return null;
      }

      try {
        const track = await videoSDK.createCameraVideoTrack({
          cameraId: webcamId,
          encoderConfig: encoderConfig || "h540p_w960p",
          optimizationMode: "motion",
          multiStream: false,
        });

        return track;
      } catch (error) {
        console.error("Error creating video track:", error);
        return null;
      }
    },
    [videoSDK]
  );

  const getAudioTrack = useCallback(
    async ({ micId }: GetAudioTrackOptions) => {
      if (!videoSDK?.createMicrophoneAudioTrack) {
        console.error("VideoSDK not loaded yet.");
        return null;
      }

      try {
        const track = await videoSDK.createMicrophoneAudioTrack({
          microphoneId: micId,
        });

        return track;
      } catch (error) {
        console.error("Error creating audio track:", error);
        return null;
      }
    },
    [videoSDK]
  );

  return { getVideoTrack, getAudioTrack, videoSDK };
};

export default useMediaStream;
