'use client';
import React from "react";

interface SessionTimerProps {
  seconds: number;
  className?: string;
}

const SessionTimer = ({ seconds, className = "" }: SessionTimerProps) => {
  // Convert seconds to MM:SS format
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`timer flex items-center gap-1 ${className}`}>
      <span className="text-sm">{formatTime(seconds)}</span>
    </div>
  );
};

export default SessionTimer;