"use client";

import { useMemo } from "react";
import useMediaStream from "./use-media-stream";
// import { Constants, useMeeting } from "@videosdk.live/react-sdk";

const useIsRecording = () => {
  const { videoSDK } = useMediaStream();

  const meeting = videoSDK?.useMeeting(); 
  const recordingState = meeting?.recordingState; 

  const isRecording = useMemo(() => {
    if (!videoSDK || !meeting) return false; 

    return (
      recordingState === videoSDK.Constants.recordingEvents.RECORDING_STARTED ||
      recordingState === videoSDK.Constants.recordingEvents.RECORDING_STOPPING
    );
  }, [recordingState, videoSDK, meeting]);

  return isRecording;
};

export default useIsRecording;
