"use client";

import VideoSDKApp from "@/components/custom/dashboard/session/meeting/video-sdk";
import { Suspense } from "react";

export default function AudioSession() {
  return (
    <div className="flex flex-col w-full h-screen bg-blue-400 lg:px-10 px-2 py-8 md:py-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VideoSDKApp />
      </Suspense>
    </div>
  );
}
