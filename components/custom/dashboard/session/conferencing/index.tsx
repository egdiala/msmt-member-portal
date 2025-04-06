'use client'
import React from "react";
import {  useMeeting } from "@/contexts/MeetingContext";
import MeetingRoom from "./meeting-room";
import { StartSession } from "../start-session";
import { useIsMobile } from "@/hooks/use-mobile";

export const MeetingContainer = () => {
  const session = {
    organization: {
      name: "Tech Innovators Hub",
      type: "Educational",
    },
    provider: {
      name: "Dr. Jane Doe",
      role: "AI Researcher",
      imageUrl: "/assets/user-dummy.png",
      date: "2025-04-10",
      time: "14:00 GMT",
      duration: "1 hour",
    },
  };

  const { isMeetingJoined } = useMeeting();
  const isMobile = useIsMobile();

  return (
    <div className={`w-full h-full ${isMobile ? "px-2" : "px-6"} py-4`}>
      {isMeetingJoined ? <MeetingRoom /> : <StartSession provider={session.provider} organization={session.organization} />}
    </div>
  );
};

