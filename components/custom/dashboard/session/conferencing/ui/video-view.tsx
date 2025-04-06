import { cn } from "@/lib/utils";
import ControlBar from "./control-bar";
import ProviderInfo from "./provider-info";
import UserThumbnail from "./user-thumbnail";

interface VideoViewProps {
  isMobile: boolean;
}

export default function VideoView({ isMobile }: VideoViewProps) {
  return (
    <div className="p-1 py-6 md:p-8 lg:p-10 h-screen">
      <div
        className={cn(
          "relative h-full w-full rounded-lg "
          //   isMobile ? "p-1 py-6" : "p-4"
        )}
      >
        <div
          className={cn(
            "h-full w-full overflow-hidden aspect-video",
            isMobile ? "rounded-none" : "rounded-lg"
          )}
        >
          <video
            src="/assets/sample-video.mp4"
            className="z-0 rounded-lg w-full h-full object-center object-cover aspect-video"
          />

          <ProviderInfo isMobile={isMobile} name="Jide Kosoko" title="Psychologist" />
          <UserThumbnail isMobile={isMobile} />

          <div className="absolute bottom-4 left-0 px-2 md:px-4 right-0 flex justify-center gap-4 w-full">
            <ControlBar isVideoMode={true} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
