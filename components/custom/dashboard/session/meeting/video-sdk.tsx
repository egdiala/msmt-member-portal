"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

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
}

// Component to fetch meeting details from backend
const VideoSDKApp: React.FC = () => {
  const [meetingConfig, setMeetingConfig] = useState<MeetingConfig | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/meeting-details");
        const data = response.data;

        setMeetingConfig({
          meetingId: data.meetingId,
          enableAudio: data.enableAudio,
          enableVideo: data.enableVideo,
          token: data.token,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching meeting details:", err);
        setError("Failed to fetch meeting details. Please try again.");
        setIsLoading(false);
      }
    };

    fetchMeetingDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-lg">
        Loading meeting...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-lg text-red-600">
        {error}
      </div>
    );
  }

  if (!meetingConfig) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-lg text-red-600">
        No meeting configuration available.
      </div>
    );
  }

  // VideoSDK configuration
  const meetingId = meetingConfig.meetingId;
  const token = meetingConfig.token;

  return (
    <div className="flex flex-col h-screen w-full p-5 box-border">
      <h2 className="text-2xl font-semibold mb-2">Video Meeting</h2>
      <p className="mb-4">Meeting ID: {meetingId}</p>

      <MeetingProvider
        config={{
          meetingId,
          micEnabled: meetingConfig.enableAudio,
          webcamEnabled: meetingConfig.enableVideo,
          name: "User",
          mode: "CONFERENCE",
          multiStream: true,
        }}
        token={token}
        joinWithoutUserInteraction
      >
        <MeetingView
          initialAudioEnabled={meetingConfig.enableAudio}
          initialVideoEnabled={meetingConfig.enableVideo}
        />
      </MeetingProvider>
    </div>
  );
};

export default VideoSDKApp;
