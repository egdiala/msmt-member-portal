"use client";

import VideoSDKApp from "@/components/custom/dashboard/session/meeting/video-sdk";
import { Suspense } from "react";

export default function AudioSession() {
  return (
    <div className="flex flex-col w-full h-screen bg-[#F3F5F9] px-10 py-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VideoSDKApp />
      </Suspense>
    </div>
  );
}
