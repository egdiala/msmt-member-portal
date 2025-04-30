"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DropMIC from "../icons/DropDown/DropMIC";
import TestMic from "../icons/DropDown/TestMic";
import TestMicOff from "../icons/DropDown/TestMicOff";
import PauseButton from "../icons/DropDown/PauseButton";
import { useMeetingAppContext } from "@/contexts/meeting-app-context-def";

interface MicDevice {
  deviceId: string;
  label: string;
  kind: string;
}

interface DropDownProps {
  mics: MicDevice[];
  changeMic: (id: string) => void;
  customAudioStream: MediaStream;
  audioTrack: MediaStreamTrack;
  micOn: boolean;
  didDeviceChange: boolean;
  setDidDeviceChange: (val: boolean) => void;
}

type RecordingStatus = "inactive" | "recording" | "stopped recording" | "playing";

export default function DropDown({
  mics,
  changeMic,
  customAudioStream,
  audioTrack,
  micOn,
  didDeviceChange,
  setDidDeviceChange,
}: DropDownProps) {
  const {
    setSelectedMic,
    selectedMic,
    selectedSpeaker,
    isMicrophonePermissionAllowed,
  } = useMeetingAppContext();

  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>("inactive");
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioAnalyserIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const mimeType = "audio/webm";

  useEffect(() => {
    audioTrackRef.current = audioTrack;

    if (audioTrack) {
      analyseAudio(audioTrack);
    } else {
      stopAudioAnalyse();
    }
  }, [audioTrack]);

  useEffect(() => {
    if (didDeviceChange) {
      setDidDeviceChange(false);
      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        stopRecording();
      }
      setRecordingProgress(0);
      setRecordingStatus("inactive");
    }
  }, [didDeviceChange, setDidDeviceChange]);

  const analyseAudio = (audioTrack: MediaStreamTrack) => {
    const audioStream = new MediaStream([audioTrack]);
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    analyser.minDecibels = -127;
    analyser.maxDecibels = 0;
    analyser.smoothingTimeConstant = 0.4;

    audioSource.connect(analyser);

    const volumes = new Uint8Array(analyser.frequencyBinCount);
    const volumeCallback = () => {
      analyser.getByteFrequencyData(volumes);
      const volumeSum = volumes.reduce((sum, vol) => sum + vol, 0);
      const averageVolume = volumeSum / volumes.length;
      setVolume(averageVolume);
    };

    audioAnalyserIntervalRef.current = setInterval(volumeCallback, 100);
  };

  const stopAudioAnalyse = () => {
    if (audioAnalyserIntervalRef.current) {
      clearInterval(audioAnalyserIntervalRef.current);
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");

    try {
      const media = new MediaRecorder(customAudioStream, { mimeType });
      mediaRecorder.current = media;
      media.start();
      let localAudioChunks: Blob[] = [];

      media.ondataavailable = (event: BlobEvent) => {
        if (!event.data.size) return;
        localAudioChunks.push(event.data);
      };

      media.onstop = () => {
        const audioBlob = new Blob(localAudioChunks, { type: mimeType });
        setAudio(URL.createObjectURL(audioBlob));
        localAudioChunks = [];
        const elapsedTime = Date.now() - startTime;
        setRecordingDuration(elapsedTime / 1000);
      };

      const startTime = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        setRecordingProgress((elapsedTime / 7000) * 100);
      }, 100);

      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        stopRecording();
      }, 7000);
    } catch (err) {
      console.error("Error starting MediaRecorder:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state !== "inactive") {
      mediaRecorder.current?.stop();
      setRecordingStatus("stopped recording");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handlePlaying = () => {
    setRecordingStatus("playing");
    const audioTags = document.getElementsByTagName("audio");
    for (let i = 0; i < audioTags.length; i++) {
      const audioTag = audioTags.item(i);
      if (audioTag) {
        audioTag
          .setSinkId(selectedSpeaker.id!)
          .then(() => {
            audioTag.play();
            audioTag.addEventListener("timeupdate", () => {
              if (audioTag) {
                const progress = (audioTag.currentTime / recordingDuration) * 100;
                setAudioProgress(progress);
              }
            });
          })
          .catch((error) => {
            console.error("Error setting sink ID:", error);
          });
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`w-44 justify-start ${
            !isMicrophonePermissionAllowed ? "opacity-50 pointer-events-none" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (mediaRecorder.current?.state === "recording") stopRecording();
            setRecordingProgress(0);
            setRecordingStatus("inactive");
          }}
        >
          <DropMIC fillColor={isHovered ? "#FFF" : "#B4B4B4"} />
          <span className="ml-4 truncate w-28">
            {isMicrophonePermissionAllowed
              ? selectedMic?.label
              : "Permission Needed"}
          </span>
          <ChevronDownIcon className="h-4 w-4 ml-auto" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-2 space-y-2">
        {mics.map((item, idx) =>
          item.kind === "audioinput" ? (
            <Button
              key={item.deviceId || idx}
              variant="ghost"
              className="flex items-center justify-start w-full text-left space-x-2"
              onClick={() => {
                setSelectedMic({ id: item.deviceId, label: item.label });
                changeMic(item.deviceId);
                if (mediaRecorder.current?.state === "recording") stopRecording();
                setRecordingProgress(0);
                setRecordingStatus("inactive");
              }}
            >
              {selectedMic?.label === item.label && (
                <CheckIcon className="h-4 w-4 text-primary" />
              )}
              <span className="truncate">{item.label || `Mic ${idx + 1}`}</span>
            </Button>
          ) : null
        )}

        <Separator />

        {micOn ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <TestMic />
              <div className="w-full bg-muted rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full"
                  style={{ width: `${((volume || 0) / 256) * 100}%` }}
                />
              </div>
            </div>

            {recordingStatus === "inactive" && (
              <Button size="sm" className="w-full" onClick={startRecording}>
                Record
              </Button>
            )}

            {recordingStatus === "stopped recording" && (
              <Button size="sm" className="w-full" onClick={handlePlaying}>
                Play
              </Button>
            )}

            {recordingStatus === "recording" && (
              <Button
                size="sm"
                variant="secondary"
                className="w-full relative overflow-hidden"
                onClick={stopRecording}
              >
                <div
                  className="absolute top-0 left-0 bg-primary opacity-50 h-full"
                  style={{ width: `${recordingProgress}%` }}
                />
                <PauseButton />
              </Button>
            )}

            {recordingStatus === "playing" && (
              <Button
                size="sm"
                variant="secondary"
                className="w-full relative overflow-hidden"
                onClick={handlePlaying}
              >
                <div
                  className="absolute top-0 left-0 bg-primary opacity-50 h-full"
                  style={{ width: `${audioProgress}%` }}
                />
                <PauseButton />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-2">
            <TestMicOff />
            No microphone input
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
