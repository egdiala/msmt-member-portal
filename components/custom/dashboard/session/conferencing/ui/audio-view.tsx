import { cn } from "@/lib/utils";
import ParticipantCard from "./participant-card";
import ControlBar from "./control-bar";

interface AudioViewProps {
  isMobile: boolean;
}

export default function AudioView({ isMobile }: AudioViewProps) {
  return (
    <div
      className={cn(
        "flex-1 bg-white min-h-screen  mx-auto w-full flex flex-col h-full items-center justify-center",
        isMobile ? "p-4" : "p-8"
      )}
    >
      <div
        className={cn(
          "flex-1 flex items-center mb-10 justify-center gap-8 h-full",
          isMobile ? "flex-col" : "flex-row"
        )}
      >
        <ParticipantCard
          imageUrl="/assets/provider.png"
          name="You"
          isMuted={true}
          width={isMobile ? 218 : 280}
          height={isMobile ? 218 : 280}
        />

        <ParticipantCard
          imageUrl="/assets/user.png"
          name="Provider"
          isMuted={false}
          isProvider={true}
          width={isMobile ? 218 : 280}
          height={isMobile ? 218 : 280}
        />
      </div>

      <ControlBar isVideoMode={false} className="absolute bottom-4 md:bottom-20 left-2 right-2 md:left-10 md:right-10" />
    </div>
  );
}
