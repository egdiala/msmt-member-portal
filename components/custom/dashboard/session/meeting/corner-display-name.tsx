"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import NetworkIcon from "../icons/NetworkIcon";
import MicOffSmallIcon from "../icons/MicOffSmallIcon";
import SpeakerIcon from "../icons/SpeakerIcon";
import { nameTructed, getQualityScore } from "@/lib/utils";
import useIsMobile from "@/hooks/use-is-mobile";
import useIsTab from "@/hooks/use-is-tab";
import useMediaStream from "@/hooks/use-media-stream";

interface Props {
  participantId: string;
  isPresenting: boolean;
  displayName: string;
  isLocal: boolean;
  micOn: boolean;
  mouseOver: boolean;
  isActiveSpeaker: boolean;
}

interface StreamStats {
  rtt?: number;
  jitter?: string;
  packetsLost?: number;
  totalPackets?: number;
  bitrate?: string;
  size?: { width: number; height: number; framerate?: number };
  codec?: string;
  currentSpatialLayer?: number;
  currentTemporalLayer?: number;
  preferredSpatialLayer?: number;
  preferredTemporalLayer?: number;
}

interface ParticipantData {
  webcamStream?: MediaStream;
  micStream?: MediaStream;
  screenShareStream?: MediaStream;
  getVideoStats?: () => Promise<StreamStats[]>;
  getAudioStats?: () => Promise<StreamStats[]>;
  getShareStats?: () => Promise<StreamStats[]>;
  getShareAudioStats?: () => Promise<StreamStats[]>;
}

export const CornerDisplayName: React.FC<Props> = ({
  participantId,
  isPresenting,
  displayName,
  isLocal,
  micOn,
  mouseOver,
  isActiveSpeaker,
}) => {
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const { videoSDK } = useMediaStream();
  const useParticipant = videoSDK?.useParticipant as
    | ((id: string) => ParticipantData | undefined)
    | undefined;

  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  function useSafeParticipant(id: string) {
    const { videoSDK } = useMediaStream();
    const useParticipant = videoSDK?.useParticipant as
      | ((id: string) => ParticipantData | undefined)
      | undefined;

    const participantData = useParticipant?.(id);

    return {
      webcamStream: participantData?.webcamStream,
      micStream: participantData?.micStream,
      screenShareStream: participantData?.screenShareStream,
      getVideoStats: participantData?.getVideoStats ?? (async () => []),
      getAudioStats: participantData?.getAudioStats ?? (async () => []),
      getShareStats: participantData?.getShareStats ?? (async () => []),
      getShareAudioStats:
        participantData?.getShareAudioStats ?? (async () => []),
    };
  }

  const {
    webcamStream,
    micStream,
    screenShareStream,
    getVideoStats,
    getAudioStats,
    getShareStats,
    getShareAudioStats,
  } = useSafeParticipant(participantId);

  const [audioStats, setAudioStats] = useState<StreamStats[]>([]);
  const [videoStats, setVideoStats] = useState<StreamStats[]>([]);
  const [score, setScore] = useState<number>(100);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const statsIntervalIdRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const analyzerSize = useMemo(() => {
    if (isXLDesktop) return 32;
    if (isLGDesktop) return 28;
    if (isTab) return 24;
    if (isMobile) return 20;
    return 18;
  }, [isXLDesktop, isLGDesktop, isTab, isMobile]);

  const show = mouseOver;

  const updateStats = async () => {
    let stats: StreamStats[] = [];
    let newAudioStats: StreamStats[] = [];
    let newVideoStats: StreamStats[] = [];

    if (isPresenting) {
      stats = await getShareStats();
    } else if (webcamStream) {
      stats = await getVideoStats();
    } else if (micStream) {
      stats = await getAudioStats();
    }

    if (webcamStream || micStream || isPresenting) {
      newVideoStats = isPresenting
        ? await getShareStats()
        : await getVideoStats();
      newAudioStats = isPresenting
        ? await getShareAudioStats()
        : await getAudioStats();
    }

    const qualityScore = stats?.length > 0 ? getQualityScore(stats[0]!) : 100;
    setScore(qualityScore);
    setAudioStats(newAudioStats);
    setVideoStats(newVideoStats);
  };

  useEffect(() => {
    if (webcamStream || micStream || screenShareStream) {
      updateStats();
      if (statsIntervalIdRef.current) clearInterval(statsIntervalIdRef.current);

      statsIntervalIdRef.current = setInterval(updateStats, 500);
    } else {
      if (statsIntervalIdRef.current) {
        clearInterval(statsIntervalIdRef.current);
        statsIntervalIdRef.current = null;
      }
    }

    return () => {
      if (statsIntervalIdRef.current) clearInterval(statsIntervalIdRef.current);
    };
  }, [webcamStream, micStream, screenShareStream]);

  const qualityStateArray = [
    { label: "", audio: "Audio", video: "Video" },
    {
      label: "Latency",
      audio: audioStats[0]?.rtt ? `${audioStats[0].rtt} ms` : "-",
      video: videoStats[0]?.rtt ? `${videoStats[0].rtt} ms` : "-",
    },
    {
      label: "Jitter",
      audio: audioStats[0]?.jitter
        ? `${parseFloat(audioStats[0].jitter).toFixed(2)} ms`
        : "-",
      video: videoStats[0]?.jitter
        ? `${parseFloat(videoStats[0].jitter).toFixed(2)} ms`
        : "-",
    },
    {
      label: "Packet Loss",
      audio:
        audioStats[0]?.packetsLost && audioStats[0]?.totalPackets
          ? `${(
              (audioStats[0].packetsLost * 100) /
              audioStats[0].totalPackets
            ).toFixed(2)}%`
          : "-",
      video:
        videoStats[0]?.packetsLost && videoStats[0]?.totalPackets
          ? `${(
              (videoStats[0].packetsLost * 100) /
              videoStats[0].totalPackets
            ).toFixed(2)}%`
          : "-",
    },
    {
      label: "Bitrate",
      audio: audioStats[0]?.bitrate
        ? `${parseFloat(audioStats[0].bitrate).toFixed(2)} kb/s`
        : "-",
      video: videoStats[0]?.bitrate
        ? `${parseFloat(videoStats[0].bitrate).toFixed(2)} kb/s`
        : "-",
    },
    {
      label: "Frame rate",
      audio: "-",
      video: videoStats[0]?.size?.framerate ?? "-",
    },
    {
      label: "Resolution",
      audio: "-",
      video: videoStats[0]?.size
        ? `${videoStats[0].size.width}x${videoStats[0].size.height}`
        : "-",
    },
    {
      label: "Codec",
      audio: audioStats[0]?.codec ?? "-",
      video: videoStats[0]?.codec ?? "-",
    },
    {
      label: "Cur. Layers",
      audio: "-",
      video:
        videoStats[0] && !isLocal
          ? `S:${videoStats[0].currentSpatialLayer ?? 0} T:${
              videoStats[0].currentTemporalLayer ?? 0
            }`
          : "-",
    },
    {
      label: "Pref. Layers",
      audio: "-",
      video:
        videoStats[0] && !isLocal
          ? `S:${videoStats[0].preferredSpatialLayer ?? 0} T:${
              videoStats[0].preferredTemporalLayer ?? 0
            }`
          : "-",
    },
  ];

  return (
    <>
      <div
        className="absolute bottom-2 left-2 rounded-md flex items-center p-2 bg-black/40 transition-transform duration-200"
        style={{ transform: `scale(${show ? 1 : 0})` }}
      >
        {!micOn && !isPresenting ? (
          <MicOffSmallIcon fillcolor="white" />
        ) : micOn && isActiveSpeaker ? (
          <SpeakerIcon />
        ) : null}
        <p className="text-sm text-white ml-2">
          {isPresenting
            ? isLocal
              ? "You are presenting"
              : `${nameTructed(displayName, 15)} is presenting`
            : isLocal
            ? "You"
            : nameTructed(displayName, 26)}
        </p>
      </div>

      {(webcamStream || micStream || screenShareStream) && (
        <div className="absolute top-2 right-2 p-2">
          <Popover>
            <PopoverTrigger
              asChild
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                const target = e.currentTarget;
                const rect = target.getBoundingClientRect();
                setCoords({
                  top: Math.round(rect.top + window.scrollY),
                  left: Math.round(rect.left + rect.width / 2),
                });
              }}
            >
              <button
                className="rounded-md p-1.5 flex items-center justify-center"
                style={{
                  backgroundColor:
                    score > 7 ? "#3BA55D" : score > 4 ? "#faa713" : "#FF5D5D",
                }}
              >
                <NetworkIcon
                  color1="#ffffff"
                  color2="#ffffff"
                  color3="#ffffff"
                  color4="#ffffff"
                  style={{
                    height: analyzerSize * 0.6,
                    width: analyzerSize * 0.6,
                  }}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              className="w-auto bg-white border shadow-md rounded-md p-4"
              style={{
                top: coords.top,
                left: coords.left,
              }}
            >
              <table className="text-sm text-left w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Audio</th>
                    <th className="px-2 py-1">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityStateArray.slice(1).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-2 py-1">{row.audio}</td>
                      <td className="px-2 py-1">{row.video}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};
