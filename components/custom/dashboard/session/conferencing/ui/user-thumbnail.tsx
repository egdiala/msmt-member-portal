import { IconMicOff } from "@/components/icons";
import Image from "next/image";

export default function UserThumbnail({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="absolute top-4 right-4 border-2 border-white bg-black/20 rounded-xl overflow-hidden">
      <div className="relative w-24 h-16 md:w-[117px] md:h-[117px]">
        <Image
          src="/assets/user.png"
          alt="You"
          width={isMobile ? 96 : 117}
          height={isMobile ? 64 : 117}
          className="object-cover"
        />
        <div className="absolute bottom-2 left-1.5 bg-blue-400 p-0.5 px-1 flex items-center gap-0.5 rounded-xs">
          <IconMicOff className="w-3 h-3 stroke-brand-1" />
          <span className="text-brand-2 text-xs">You</span>
        </div>
      </div>
    </div>
  );
}
