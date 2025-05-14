"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { requestLiveSession } from "@/services/api/session";

const MeetingProvider = dynamic(
  () => import("@videosdk.live/react-sdk").then((mod) => mod.MeetingProvider),
  { ssr: false }
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
  participantName?: string;
  participantRole?: "Provider" | "Patient";
}

interface DeviceInfo {
  deviceId: string;
  label: string;
}

// Device Selection Modal Component
const DeviceSelectionModal: React.FC<{
  onJoin: (
    audioEnabled: boolean,
    videoEnabled: boolean,
    audioDeviceId?: string,
    videoDeviceId?: string
  ) => void;
  initialAudioEnabled: boolean;
  initialVideoEnabled: boolean;
}> = ({ onJoin, initialAudioEnabled, initialVideoEnabled }) => {
  const [audioDevices, setAudioDevices] = useState<DeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<DeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [audioEnabled, setAudioEnabled] =
    useState<boolean>(initialAudioEnabled);
  const [videoEnabled, setVideoEnabled] =
    useState<boolean>(initialVideoEnabled);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoPreviewRef = React.useRef<HTMLVideoElement>(null);
  const deviceInitializedRef = React.useRef<boolean>(false);

  useEffect(() => {
    const getDevices = async () => {
      // Prevent multiple executions
      if (deviceInitializedRef.current) return;
      deviceInitializedRef.current = true;

      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        // Get all devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = devices
          .filter((device) => device.kind === "audioinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label:
              device.label || `Microphone ${device.deviceId.slice(0, 5)}...`,
          }));

        const videoInputs = devices
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`,
          }));

        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);

        if (audioInputs.length > 0) {
          setSelectedAudioDevice(audioInputs[0].deviceId);
        }

        if (videoInputs.length > 0) {
          setSelectedVideoDevice(videoInputs[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting media devices:", err);
        // If permission denied, still allow the user to join without selecting devices
      }
    };

    getDevices();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const startVideoPreview = async () => {
      try {
        // Stop any existing tracks
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
          setVideoStream(null);
        }

        if (videoEnabled && selectedVideoDevice && videoPreviewRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedVideoDevice } },
          });

          videoPreviewRef.current.srcObject = stream;
          setVideoStream(stream);
        }
      } catch (err) {
        console.error("Error starting video preview:", err);
      }
    };

    startVideoPreview();
  }, [selectedVideoDevice, videoEnabled]);

  const handleJoin = () => {
    // Stop the preview stream
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    onJoin(audioEnabled, videoEnabled);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Join Meeting</h2>

        {/* Audio Device Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Audio</label>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={audioEnabled}
                onChange={() => setAudioEnabled((prev) => !prev)}
                className="sr-only"
                id="toggle-audio"
              />
              <label
                htmlFor="toggle-audio"
                className={`block h-6 rounded-full cursor-pointer transition-colors ${
                  audioEnabled ? "bg-brand-accent-2" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    audioEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {audioEnabled && (
            <select
              value={selectedAudioDevice}
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={!audioEnabled}
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
              {audioDevices.length === 0 && (
                <option value="">No microphones available</option>
              )}
            </select>
          )}
        </div>

        {/* Video Device Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Video</label>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={videoEnabled}
                onChange={() => setVideoEnabled((prev) => !prev)}
                className="sr-only"
                id="toggle-video"
              />
              <label
                htmlFor="toggle-video"
                className={`block h-6 rounded-full cursor-pointer transition-colors ${
                  videoEnabled ? "bg-brand-accent-2" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                    videoEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {videoEnabled && (
            <>
              <select
                value={selectedVideoDevice}
                onChange={(e) => setSelectedVideoDevice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                disabled={!videoEnabled}
              >
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
                {videoDevices.length === 0 && (
                  <option value="">No cameras available</option>
                )}
              </select>

              {/* Video Preview */}
              <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden">
                {videoEnabled ? (
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Camera off</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleJoin}
            className="px-4 py-2 bg-brand-accent-2 text-white rounded "
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to fetch meeting details from backend
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
      // Prevent multiple API calls
      if (apiCallMadeRef.current) return;
      apiCallMadeRef.current = true;

      try {
        setIsLoading(true);
        const response = await requestLiveSession({
          appointment_id: appointment_id as string,
          user_id: user_id as string,
        });
        const data = response.data;

        setMeetingConfig({
          meetingId: data.meeting_id,
          enableAudio: userAudioEnabled,
          enableVideo: userVideoEnabled,
          token: data?.token,
          participantName: data.isHost
            ? data?.provider_name
            : data?.member_name,
          participantRole: data.isHost ? "Provider" : "Patient",
        });
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
  }, [appointment_id, user_id]);

  useEffect(() => {
    const initializeMediaDevices = async () => {
      if (meetingJoined && meetingConfig && !mediaInitialized) {
        try {
          if (selectedVideoDeviceId && userVideoEnabled) {
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

          // Similar improvement for audio
          if (selectedAudioDeviceId && userAudioEnabled) {
            try {
              console.log("Initializing audio device:", selectedAudioDeviceId);
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
    if (audioDeviceId) setSelectedAudioDeviceId(audioDeviceId);
    if (videoDeviceId) setSelectedVideoDeviceId(videoDeviceId);
    setUserAudioEnabled(audioEnabled);
    setUserVideoEnabled(videoEnabled);
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
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-accent-2 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
      />
    );
  }
  // VideoSDK configuration
  const { meetingId, token, participantRole } = meetingConfig;
  const participantName = meetingConfig.participantName || "Guest";
  const isProvider = participantRole === "Provider";

  const configOptions = {
    meetingId,
    name: participantName,
    mode: "SEND_AND_RECV",
    token,
    layout: "GRID",
    multiStream: true,
    micEnabled: userAudioEnabled,
    webcamEnabled: userVideoEnabled,
    ...(selectedAudioDeviceId && { micId: selectedAudioDeviceId }),
    ...(selectedVideoDeviceId && { webcamId: selectedVideoDeviceId }),
    debugMode: true,
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="flex-1 h-full mx-auto w-full">
        <MeetingProvider
          config={configOptions as any}
          token={token}
          reinitialiseMeetingOnConfigChange={true}
          joinWithoutUserInteraction={true}
        >
          <MeetingView
            meetingId={meetingId}
            participantName={participantName}
            isProvider={isProvider}
          />
        </MeetingProvider>
      </div>
    </div>
  );
};

export default VideoSDKApp;
