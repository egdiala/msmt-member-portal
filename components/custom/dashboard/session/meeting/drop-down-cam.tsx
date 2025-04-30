'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import DropCAM from "../icons/DropDown/DropCAM";
import { useMeetingAppContext } from "@/contexts/meeting-app-context-def";
import { Button } from "@/components/ui/button"; 

interface WebcamDevice {
  deviceId: string;
  label: string;
  kind: string;
}

interface SelectedWebcam {
  id: string;
  label: string;
}

interface DropDownCamProps {
  webcams: WebcamDevice[];
  changeWebcam: (deviceId: string) => void;
}

export default function DropDownCam({ webcams, changeWebcam }: DropDownCamProps) {
  const { setSelectedWebcam, selectedWebcam, isCameraPermissionAllowed } = useMeetingAppContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleSelectWebcam = (device: WebcamDevice) => {
    setSelectedWebcam({
      id: device.deviceId,
      label: device.label,
    });
    changeWebcam(device.deviceId);
  };

  return (
    <div className="relative ml-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={!isCameraPermissionAllowed}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group inline-flex items-center rounded-md px-1 py-1 w-44 text-base font-normal focus:outline-none hover:ring-1 hover:ring-gray-250 hover:bg-black
              ${!isCameraPermissionAllowed ? "opacity-50" : ""}
              ${isCameraPermissionAllowed ? "hover:text-white" : "text-customGray-250"}
            `}
          >
            <DropCAM fillColor={isHovered ? "#FFF" : "#B4B4B4"} />
            <span className="overflow-hidden whitespace-nowrap overflow-ellipsis w-28 ml-7">
              {isCameraPermissionAllowed ? selectedWebcam?.label : "Permission Needed"}
            </span>
            <ChevronDown
              className="ml-8 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80 text-orange-300 mt-1"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 p-4 bg-gray-350 rounded-lg shadow-lg">
          <div className="flex flex-col">
            {webcams.map((item, index) => (
              item.kind === "videoinput" && (
                <div
                  key={`webcam_${index}`}
                  className="my-1 pl-4 pr-2 text-white text-left flex"
                >
                  <span className="w-6 mr-2 flex items-center justify-center">
                    {selectedWebcam?.label === item.label && (
                      <Check className="h-5 w-5" />
                    )}
                  </span>
                  <button
                    type="button"
                    className="flex flex-1 w-full text-left"
                    onClick={() => handleSelectWebcam(item)}
                  >
                    {item.label ? (
                      <span>{item.label}</span>
                    ) : (
                      <span>{`Webcam ${index + 1}`}</span>
                    )}
                  </button>
                </div>
              )
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
