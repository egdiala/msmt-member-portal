import Image from "next/image";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconMicOff } from "@/components/icons";

interface ParticipantCardProps {
  imageUrl: string;
  name: string;
  isMuted: boolean;
  isProvider?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function ParticipantCard({
  imageUrl,
  name,
  isMuted,
  isProvider = false,
  width = 180,
  height = 180,
  className,
}: ParticipantCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        isProvider && "border-2 border-blue-400",
        className
      )}
    >
      <Image
        src={imageUrl || "/assets/blank-profile-picture.png"}
        alt={name}
        width={width}
        height={height}
        className="object-cover"
      />
      <div className="absolute bottom-4 md:bottom-5 left-3 bg-blue-400 rounded-lg h-10 px-2 py-1 flex items-center gap-1 text-xs">
        {isMuted ? (
          <IconMicOff className="w-5 h-5 md:w-6 md:h-6 stroke-status-danger" />
        ) : (
          <Mic className="w-6 h-6 text-brand-2" />
        )}
        <span className="text-brand-2 text-sm md:text-lg font-medium">
          {name}
        </span>
      </div>
    </div>
  );
}
