import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  isVideoMode?: boolean
  className?: string
}

export default function Timer({ isVideoMode = false, className }: TimerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-3 py-1 rounded-full",
        isVideoMode ? "bg-white/80" : "border border-gray-300",
        className,
      )}
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm">23:45</span>
    </div>
  )
}

