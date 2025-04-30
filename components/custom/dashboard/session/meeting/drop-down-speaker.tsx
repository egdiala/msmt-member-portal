"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useMeetingAppContext } from "@/contexts/meeting-app-context-def";
import DropSpeaker from "../icons/DropDown/DropSpeaker";
import TestSpeaker from "../icons/DropDown/TestSpeaker";
import test_sound from "../sounds/test_sound.mp3";

interface SpeakerDevice {
  deviceId: string;
  label: string;
  kind: string;
}

type Speaker = {
  id: string;
  label: string;
};

interface DropDownSpeakerProps {
  speakers: SpeakerDevice[];
}

export default function DropDownSpeaker({ speakers }: DropDownSpeakerProps) {
  const { setSelectedSpeaker, selectedSpeaker, isMicrophonePermissionAllowed } =
    useMeetingAppContext();

  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const testSpeakers = () => {
    const selectedSpeakerDeviceId = selectedSpeaker?.id;
    if (selectedSpeakerDeviceId) {
      const audio = new Audio(test_sound);

      audio
        .setSinkId(selectedSpeakerDeviceId)
        .then(() => {
          audio.play();
          setIsPlaying(true);

          audio.addEventListener("timeupdate", () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            setAudioProgress(progress);
          });

          audio.addEventListener("ended", () => {
            setAudioProgress(0);
            setIsPlaying(false);
          });
        })
        .catch((error) => {
          console.error("Failed to set sinkId:", error);
        });
    } else {
      console.error("Selected speaker deviceId not found.");
    }
  };

  return (
    <div className="relative ml-3">
      <Popover>
        <PopoverTrigger
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={!isMicrophonePermissionAllowed}
          className={`group inline-flex items-center rounded-md px-1 py-1 w-44 text-base font-normal focus:outline-none hover:ring-1 hover:ring-gray-250 hover:bg-black
            ${isMicrophonePermissionAllowed ? "" : "opacity-50"}
            ${
              !isMicrophonePermissionAllowed
                ? "text-customGray-250"
                : "hover:text-white"
            }
          `}
        >
          <DropSpeaker fillColor={isHovered ? "#FFF" : "#B4B4B4"} />
          <span className="overflow-hidden whitespace-nowrap overflow-ellipsis w-28 ml-6">
            {isMicrophonePermissionAllowed
              ? selectedSpeaker?.label
              : "Permission Needed"}
          </span>
          <ChevronDown
            className="ml-8 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80 text-orange-300 mt-1"
            aria-hidden="true"
          />
        </PopoverTrigger>

        <PopoverContent className="w-72 p-4 bg-gray-350 rounded-lg shadow-lg">
          <div className="flex flex-col">
            {speakers.map(
              (item, index) =>
                item.kind === "audiooutput" && (
                  <div
                    key={`speaker_${index}`}
                    className="my-1 pl-4 pr-2 text-white text-left flex"
                  >
                    <span className="w-6 mr-2 flex items-center justify-center">
                      {selectedSpeaker?.label === item.label && (
                        <Check className="h-5 w-5" />
                      )}
                    </span>
                    <button
                      className="flex flex-1 w-full text-left"
                      value={item.deviceId}
                      onClick={() => {
                        setSelectedSpeaker({
                          id: item.deviceId,
                          label: item.label,
                        });
                      }}
                    >
                      {item.label ? (
                        <span>{item.label}</span>
                      ) : (
                        <span>{`Speaker ${index + 1}`}</span>
                      )}
                    </button>
                  </div>
                )
            )}

            {speakers.length > 0 && (
              <>
                <hr className="border border-gray-50 mt-2 mb-1" />
                <div className="my-1 pl-4 pr-2 text-white text-left">
                  <button
                    className="flex flex-1 w-full text-left mb-1 pl-1 focus:outline-none"
                    onClick={testSpeakers}
                  >
                    <span className="mr-3">
                      <TestSpeaker />
                    </span>
                    {isPlaying ? (
                      <div className="w-52 mt-2 bg-gray-450 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-white opacity-50 h-2 rounded-full"
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                      </div>
                    ) : (
                      <span>Test Speakers</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
