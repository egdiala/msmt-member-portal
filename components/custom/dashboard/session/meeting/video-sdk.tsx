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
  participantName?: string;
  participantRole?: "provider" | "patient";
}

// Component to fetch meeting details from backend
const VideoSDKApp: React.FC = () => {
  const [meetingConfig, setMeetingConfig] = useState<MeetingConfig | null>(null);
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
          participantName: data.participantName || "User",
          participantRole: data.participantRole || "patient",
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
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-700">Setting up your meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
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

  if (!meetingConfig) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">No Meeting Configuration</h2>
          <p className="text-gray-700 mb-4">Unable to retrieve meeting details. Please check your connection and try again.</p>
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

  // VideoSDK configuration
  const { meetingId, token, participantName, participantRole } = meetingConfig;
  const isProvider = participantRole === "provider";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-600">
            {isProvider ? "Provider Dashboard" : "Virtual Care Session"}
          </h1>
          <div className="text-sm">
            <span className="font-medium">Meeting ID:</span> {meetingId}
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 max-w-6xl mx-auto w-full">
        <MeetingProvider
          config={{
            meetingId,
            micEnabled: meetingConfig.enableAudio,
            webcamEnabled: meetingConfig.enableVideo,
            name: participantName,
            mode: "CONFERENCE",
            multiStream: true,
          }}
          token={token}
          joinWithoutUserInteraction
        >
          <MeetingView
            initialAudioEnabled={meetingConfig.enableAudio}
            initialVideoEnabled={meetingConfig.enableVideo}
            isProvider={isProvider}
          />
        </MeetingProvider>
      </div>

      <footer className="bg-white border-t p-3 text-center text-sm text-gray-600">
        <p>© 2025 Virtual Care Platform - Secure Telemedicine Sessions</p>
      </footer>
    </div>
  );
};

export default VideoSDKApp;