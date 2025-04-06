import {
  IconEndCall,
  IconVideo,
  IconMic,
  IconSpeaker,
  IconShare2,
} from "@/components/icons";
import Timer from "./timer";
import { cn } from "@/lib/utils";
import { RenderIf } from "@/components/shared";

interface ControlBarProps {
  isVideoMode?: boolean;
  className?: string;
}

export default function ControlBar({
  isVideoMode = false,
  className,
}: ControlBarProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button
        className={cn(
          "py-2 px-3 h-10 md:p-3 md:px-4.5 md:h-12  bg-blue-400 rounded-full text-brand-1  "
        )}
      >
        <IconShare2 className="w-4 h-4 md:w-5 md:h-5 stroke-brand-1" />
      </button>

      <div className="flex items-center gap-3 md:gap-4">
        <RenderIf condition={isVideoMode}>
          <button
            className={cn(
              "py-2 px-3 h-10 md:p-3 md:px-4.5 md:h-12  bg-blue-400 text-brand-1 rounded-full"
            )}
          >
            <IconVideo className="w-4 h-4 md:w-5 md:h-5 stroke-brand-1" />
          </button>
        </RenderIf>
        <button
          className={cn(
            "py-2 px-3 h-10 md:p-3 md:px-4.5 md:h-12  bg-blue-400 text-brand-1 rounded-full"
          )}
        >
          <IconMic className="w-4 h-4 md:w-5 md:h-5 stroke-brand-1" />
        </button>
        <button
          className={cn(
            "py-2 px-3 h-10 md:p-3 md:px-4.5 md:h-12 bg-blue-400  text-brand-1 rounded-full"
          )}
        >
          <IconSpeaker className="=w-4 h-4 md:w-5 md:h-5 stroke-brand-1" />
        </button>
        <button className="py-2 px-3 h-10 md:p-3 md:px-4.5 md:h-12  bg-status-danger rounded-full text-white">
          <IconEndCall className="!w-6 !h-6 !stroke-white" />
        </button>
      </div>

      <Timer />
    </div>
  );
}
