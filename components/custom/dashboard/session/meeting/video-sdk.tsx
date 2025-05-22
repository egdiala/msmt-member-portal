"use client";
import { useSearchParams } from "next/navigation";
import DeviceSelectionModal from "./device-selection-modal";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { requestLiveSession } from "@/services/api/session";
import { ErrorModal } from "./error-modal";

const MeetingProvider = dynamic(
  () => import("@videosdk.live/react-sdk").then((mod) => mod.MeetingProvider),
  {
    ssr: false,
  }
);

const MeetingView = dynamic(
  () => import("./meeting-view").then((mod) => mod.default),
  { ssr: false }
);

interface MeetingConfig {
  meetingId: string;
  enableAudio: boolean;
  enableVideo: boolean;
  token: string;
  metaData: {
    name: string;
    avatar: string;
  };
  participantId?: string;
  participantName?: string;
  participantRole?: "Provider" | "Patient";
  commMode: "audio" | "video"; // Add communication mode
}

const VideoSDKApp: React.FC = () => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const appointment_id = searchParams.get("appointment_id");
  const [meetingConfig, setMeetingConfig] = useState<MeetingConfig | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeviceSelection, setShowDeviceSelection] =
    useState<boolean>(false);
  const [userAudioEnabled, setUserAudioEnabled] = useState<boolean>(false);
  const [userVideoEnabled, setUserVideoEnabled] = useState<boolean>(false);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState<string>("");
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState<string>("");
  const [meetingJoined, setMeetingJoined] = useState<boolean>(false);
  const [mediaInitialized, setMediaInitialized] = useState<boolean>(false);
  const apiCallMadeRef = React.useRef<boolean>(false);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (apiCallMadeRef.current) return;
      apiCallMadeRef.current = true;

      try {
        setIsLoading(true);
        const response = await requestLiveSession({
          appointment_id: appointment_id as string,
          user_id: user_id as string,
        });
        const data = response.data;

        const displayName = data?.is_host
          ? data?.provider_name
          : data?.member_name;

        const displayAvatar = data?.is_host
          ? data?.provider_avatar
          : data?.member_avatar;

        const commMode = data?.comm_mode === "video" ? "video" : "audio";

        setMeetingConfig({
          meetingId: data.meeting_id,
          enableAudio: true, // Always enable audio
          enableVideo: commMode === "video", // Only enable video for video mode
          token: data?.token,
          participantName: displayName,
          participantRole: data?.is_host ? "Provider" : "Patient",
          participantId: user_id as string,
          metaData: {
            name: displayName,
            avatar: displayAvatar,
          },
          commMode,
        });

        if (displayName) {
          window.localStorage.setItem("videosdk-participant-name", displayName);
        }

        setIsLoading(false);
        setShowDeviceSelection(true);
      } catch (err) {
        console.error("Error fetching meeting details:", err);
        setError("Failed to fetch meeting details. Please try again.");
        setIsLoading(false);
      }
    };

    if (appointment_id && user_id) {
      fetchMeetingDetails();
    }
  }, [appointment_id, user_id, userAudioEnabled, userVideoEnabled]);

  useEffect(() => {
    const initializeMediaDevices = async () => {
      if (meetingJoined && meetingConfig && !mediaInitialized) {
        try {
          if (
            selectedVideoDeviceId &&
            userVideoEnabled &&
            meetingConfig.commMode === "video"
          ) {
            try {
              console.log("Initializing video device:", selectedVideoDeviceId);
              const constraints = {
                video: selectedVideoDeviceId
                  ? { deviceId: { exact: selectedVideoDeviceId } }
                  : true,
              };

              const videoStream = await navigator.mediaDevices.getUserMedia(
                constraints
              );

              if (videoStream.getVideoTracks().length === 0) {
                console.warn(
                  "No video tracks in stream, falling back to default camera"
                );
                const defaultStream = await navigator.mediaDevices.getUserMedia(
                  { video: true }
                );
                defaultStream.getTracks().forEach((track) => track.stop());
              } else {
                console.log(
                  "Successfully initialized video device with tracks:",
                  videoStream.getVideoTracks().length
                );
              }

              videoStream.getTracks().forEach((track) => track.stop());
            } catch (err) {
              console.warn(
                "Error initializing specific video device, falling back to default:",
                err
              );
              try {
                const fallbackStream =
                  await navigator.mediaDevices.getUserMedia({ video: true });
                fallbackStream.getTracks().forEach((track) => track.stop());
              } catch (fallbackErr) {
                console.error(
                  "Failed to initialize any video device:",
                  fallbackErr
                );
                setUserVideoEnabled(false);
              }
            }
          }

          if (selectedAudioDeviceId && userAudioEnabled) {
            try {
              const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: selectedAudioDeviceId } },
              });
              audioStream.getTracks().forEach((track) => track.stop());
            } catch (err) {
              console.warn(
                "Error initializing specific audio device, falling back to default:",
                err
              );
              try {
                const fallbackStream =
                  await navigator.mediaDevices.getUserMedia({ audio: true });
                fallbackStream.getTracks().forEach((track) => track.stop());
              } catch (fallbackErr) {
                console.error(
                  "Failed to initialize any audio device:",
                  fallbackErr
                );
                setUserAudioEnabled(false);
              }
            }
          }

          setMediaInitialized(true);
        } catch (err) {
          console.error("Error during media initialization:", err);
          setMediaInitialized(true);
        }
      }
    };

    initializeMediaDevices();
  }, [
    meetingJoined,
    meetingConfig,
    selectedAudioDeviceId,
    selectedVideoDeviceId,
    userAudioEnabled,
    userVideoEnabled,
    mediaInitialized,
  ]);

  const handleJoinWithDevices = (
    audioEnabled: boolean,
    videoEnabled: boolean,
    audioDeviceId?: string,
    videoDeviceId?: string
  ) => {
    const finalVideoEnabled =
      meetingConfig?.commMode === "audio" ? false : videoEnabled;

    if (audioDeviceId) setSelectedAudioDeviceId(audioDeviceId);
    if (videoDeviceId) setSelectedVideoDeviceId(videoDeviceId);
    setUserAudioEnabled(audioEnabled);
    setUserVideoEnabled(finalVideoEnabled);
    setShowDeviceSelection(false);
    setMeetingJoined(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] w-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-700">Setting up your meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorModal error={error} />;
  }

  if (!meetingConfig) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Meeting Configuration
          </h2>
          <p className="text-gray-700 mb-4">
            Unable to retrieve meeting details. Please check your connection and
            try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showDeviceSelection) {
    return (
      <DeviceSelectionModal
        onJoin={handleJoinWithDevices}
        initialAudioEnabled={meetingConfig.enableAudio}
        initialVideoEnabled={meetingConfig.enableVideo}
        // commMode={meetingConfig.commMode}
      />
    );
  }
  const { meetingId, token, participantRole, commMode } = meetingConfig;
  const participantName = meetingConfig.participantName || "Guest";
  console.log(meetingConfig.participantName, "Participant Name");
  const isProvider = participantRole === "Provider";

  const configOptions = {
    meetingId,
    name: participantName,
    participantId: meetingConfig.participantId,
    metaData: meetingConfig.metaData,
    micEnabled: userAudioEnabled,
    webcamEnabled: userVideoEnabled,
    debugMode: true,
    displayName: participantName,
    token,
    layout: "GRID",
    multiStream: true,
    notification: {
      title: "Live Session",
      description: `You are in a live session with your provider ${participantName}`,
    },
    ...(selectedAudioDeviceId && { micId: selectedAudioDeviceId }),
    ...(selectedVideoDeviceId && { webcamId: selectedVideoDeviceId }),
  };

  return (
    <div className="flex flex-col h-full overflow-y-hidden ">
      <div className="flex-1 h-full mx-auto w-full">
        <MeetingProvider
          config={configOptions as any}
          token={token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingView
            meetingId={meetingId}
            isProvider={isProvider}
            commMode={commMode}
          />
        </MeetingProvider>
      </div>
    </div>
  );
};

export default VideoSDKApp;
