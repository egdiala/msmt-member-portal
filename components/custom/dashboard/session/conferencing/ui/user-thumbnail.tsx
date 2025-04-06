import { IconMicOff } from "@/components/icons"
import Image from "next/image"


export default function UserThumbnail() {
  return (
    <div className="absolute top-4 right-4 border border-white/30 bg-black/20 rounded-lg overflow-hidden">
      <div className="relative w-20 h-14">
        <Image src="/placeholder.svg?height=56&width=80" alt="You" width={80} height={56} className="object-cover" />
        <div className="absolute bottom-1 right-1 bg-white/80 rounded-full p-0.5">
          <IconMicOff  className="w-2 h-2" />
        </div>
      </div>
    </div>
  )
}

