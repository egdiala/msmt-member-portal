import { cn } from "@/lib/utils"
import ParticipantCard from "./participant-card"
import ControlBar from "./control-bar"


interface AudioViewProps {
  isMobile: boolean
}

export default function AudioView({ isMobile }: AudioViewProps) {
  return (
    

      <div className={cn("flex-1 bg-white mx-auto w-full flex flex-col", isMobile ? "p-4" : "p-8")}>
        <div className={cn("flex-1 flex items-center justify-center gap-8", isMobile ? "flex-col" : "flex-row")}>
          <ParticipantCard
            imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-05%20204720-XqxDS7beUim1Go3d5KT1Hwbt2qYBbn.png"
            name="You"
            isMuted={true}
            width={isMobile ? 200 : 180}
            height={isMobile ? 200 : 180}
          />

          <ParticipantCard
            imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-05%20204720-XqxDS7beUim1Go3d5KT1Hwbt2qYBbn.png"
            name="Provider"
            isMuted={false}
            isProvider={true}
            width={isMobile ? 200 : 180}
            height={isMobile ? 200 : 180}
          />
        </div>

        <ControlBar className="mt-8" />
      </div>

   
 
  )
}

