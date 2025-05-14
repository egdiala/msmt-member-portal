"use client";

import React, { Suspense } from "react";
import { StartSession } from "@/components/custom/dashboard/session/start-session";

const SessionPage = () => {
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartSession
        provider={session.provider}
        organization={session.organization}
      />
    </Suspense>
  );
};

export default SessionPage;
