import Image from "next/image"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconMicOff } from "@/components/icons"

interface ParticipantCardProps {
  imageUrl: string
  name: string
  isMuted: boolean
  isProvider?: boolean
  width?: number
  height?: number
  className?: string
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
    <div className={cn("relative rounded-lg overflow-hidden", isProvider && "border-2 border-blue-400", className)}>
      <Image src={imageUrl || "/placeholder.svg"} alt={name} width={width} height={height} className="object-cover" />
      <div className="absolute bottom-3 left-3 bg-white rounded-full px-2 py-1 flex items-center gap-1 text-xs">
        {isMuted ? <IconMicOff className="w-3 h-3 stroke-red-500" /> : <Mic className="w-3 h-3" />}
        <span>{name}</span>
      </div>
    </div>
  )
}

