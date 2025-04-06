import Image from "next/image"
import { cn } from "@/lib/utils"
import ControlBar from "./control-bar"
import ProviderInfo from "./provider-info"
import UserThumbnail from "./user-thumbnail"

interface VideoViewProps {
  isMobile: boolean
}

export default function VideoView({ isMobile }: VideoViewProps) {
  return (
    <div className={cn("relative h-screen bg-gray-100", isMobile ? "p-0" : "p-4")}>
      <div className={cn("h-full w-full overflow-hidden", isMobile ? "rounded-none" : "rounded-lg")}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-05%20203619-tQCnRcJliV2AyaF34zoXXGX3YocBuV.png"
          alt="Doctor video call"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />

        <ProviderInfo name="Jide Kosoko" title="Psychologist" />
        <UserThumbnail />

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <div className={cn("flex items-center gap-4 p-2 rounded-full", isMobile ? "bg-white/10" : "bg-white/80")}>
            <ControlBar isVideoMode={true} />
          </div>
        </div>

      </div>
    </div>
  )
}

