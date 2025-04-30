'use client'

import { useMeeting } from "@videosdk.live/react-sdk";
import { X } from "lucide-react"; 
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useIsMobile from "@/hooks/use-is-mobile";
import useIsTab from "@/hooks/use-is-tab";
import { ChatPanel } from "./chat-panel";
import { ParticipantPanel } from "./participant-panel";
import { useMediaQuery } from "react-responsive";
import { useMeetingAppContext } from "@/contexts/meeting-app-context-def";


interface SideBarTabViewProps {
  height: string | number;
  sideBarContainerWidth: string | number;
  panelHeight: number;
  panelHeaderHeight: number;
  panelHeaderPadding: number;
  panelPadding: number;
  handleClose: () => void;
}

const SideBarTabView: React.FC<SideBarTabViewProps> = ({
  height,
  sideBarContainerWidth,
  panelHeight,
  panelHeaderHeight,
  panelHeaderPadding,
  panelPadding,
  handleClose,
}) => {
  const { participants } = useMeeting();
  const { sideBarMode } = useMeetingAppContext();

  const sideBarTitle = sideBarMode
    ? sideBarMode.charAt(0).toUpperCase() + sideBarMode.slice(1).toLowerCase()
    : "";

  const participantsCount = new Map(participants).size;

  return (
    <div
      className="bg-gray-800"
      style={{
        height,
        width: sideBarContainerWidth,
        padding: panelPadding,
      }}
    >
      <div className="bg-gray-750 rounded-lg overflow-hidden" style={{ height }}>
        {sideBarMode && (
          <div
            className="flex items-center justify-between border-b border-gray-700"
            style={{
              padding: panelHeaderPadding,
              height: panelHeaderHeight - 1,
            }}
          >
            <p className="text-base font-bold text-white">
              {sideBarMode === "PARTICIPANTS"
                ? `${sideBarTitle} (${participantsCount})`
                : sideBarTitle}
            </p>
            <button
              onClick={handleClose}
              className="text-white p-0 m-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {sideBarMode === "PARTICIPANTS" && (
          <ParticipantPanel panelHeight={panelHeight} />
        )}
        {sideBarMode === "CHAT" && (
          <ChatPanel panelHeight={panelHeight} />
        )}
      </div>
    </div>
  );
};

interface SidebarContainerProps {
  height: number;
  sideBarContainerWidth: number | string;
}

export const SidebarContainer: React.FC<SidebarContainerProps> = ({ height, sideBarContainerWidth }) => {
  const { raisedHandsParticipants, sideBarMode, setSideBarMode } = useMeetingAppContext();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  const panelPadding = 8;

  const paddedHeight = height - panelPadding * 3.5;

  const panelHeaderHeight = isMobile
    ? 40
    : isTab
    ? 44
    : isLGDesktop
    ? 48
    : isXLDesktop
    ? 52
    : 0;

  const panelHeaderPadding = isMobile
    ? 6
    : isTab
    ? 8
    : isLGDesktop
    ? 10
    : isXLDesktop
    ? 12
    : 0;

  const handleClose = () => {
    setSideBarMode(null);
  };

  if (!sideBarMode) return null;

  if (isMobile || isTab) {
    return (
      <Sheet open={!!sideBarMode} onOpenChange={() => handleClose()}>
        <SheetContent side="right" className="bg-gray-800 p-0">
          <SheetHeader className="flex flex-row justify-between items-center px-4 py-2 border-b border-gray-700">
            <SheetTitle className="text-white">
              {sideBarMode === "PARTICIPANTS" ? `Participants` : sideBarMode}
            </SheetTitle>
            <button onClick={handleClose} className="text-white">
              <X className="h-5 w-5" />
            </button>
          </SheetHeader>
          <SideBarTabView
            height="100%"
            sideBarContainerWidth="100%"
            panelHeight={height}
            panelHeaderHeight={panelHeaderHeight}
            panelHeaderPadding={panelHeaderPadding}
            panelPadding={panelPadding}
            handleClose={handleClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <SideBarTabView
      height={paddedHeight}
      sideBarContainerWidth={sideBarContainerWidth}
      panelHeight={paddedHeight - panelHeaderHeight - panelHeaderPadding}
      panelHeaderHeight={panelHeaderHeight}
      panelHeaderPadding={panelHeaderPadding}
      panelPadding={panelPadding}
      handleClose={handleClose}
    />
  );
};
