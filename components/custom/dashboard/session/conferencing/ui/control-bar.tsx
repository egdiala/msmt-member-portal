import { Share2, Mic, Volume2, PhoneOff } from "lucide-react"
import Timer from "./timer"
import { cn } from "@/lib/utils"

interface ControlBarProps {
  isVideoMode?: boolean
  isMobile?: boolean
  className?: string
}

export default function ControlBar({ isVideoMode = false, isMobile = false, className }: ControlBarProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button className={cn("p-2", isVideoMode ? "bg-white rounded-full" : "text-gray-500 hover:text-gray-700")}>
        <Share2 className="w-5 h-5" />
      </button>

      <div className="flex gap-4">
        <button className={cn("p-3 rounded-full", isVideoMode ? "bg-white" : "bg-blue-500 text-white")}>
          <Mic className="w-5 h-5" />
        </button>
        <button className={cn("p-3 rounded-full", isVideoMode ? "bg-white" : "bg-gray-200 text-gray-700")}>
          <Volume2 className="w-5 h-5" />
        </button>
        <button className="p-3 bg-red-500 rounded-full text-white">
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      <Timer isVideoMode={isVideoMode} />
    </div>
  )
}

