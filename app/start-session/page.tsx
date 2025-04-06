"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AudioView from "@/components/custom/dashboard/session/conferencing/ui/audio-view";
import VideoView from "@/components/custom/dashboard/session/conferencing/ui/video-view";

export default function AudioSession() {
  const isMobile = useIsMobile();
  const [view, ] = useState<"audio" | "video">("audio");

  return (
    <div>
      {view === "audio" ? (
        <AudioView isMobile={isMobile} />
      ) : (
        <VideoView isMobile={isMobile} />
      )}
    </div>
  );
}
