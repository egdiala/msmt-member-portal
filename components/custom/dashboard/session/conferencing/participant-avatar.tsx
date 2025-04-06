import React from "react";
import Image from "next/image";
interface ParticipantAvatarProps {
  name: string;
  role: string;
  imageUrl: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  isYou?: boolean;
  className?: string;
}

const ParticipantAvatar = ({
  name,
  role,
  imageUrl,
  isSpeaking = false,
//   isMuted = false,
  isYou = false,
  className = "",
}: ParticipantAvatarProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`avatar-container ${isSpeaking ? "active-speaker border-blue-500" : "border-transparent"}`}>
        <Image
          src={imageUrl} 
          alt={`${name}'s avatar`} 
          width={100}
          height={100}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
          {isYou ? "You" : role}
        </div>
      </div>
    </div>
  );
};

export default ParticipantAvatar;