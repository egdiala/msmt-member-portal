"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import useMediaStream from "@/hooks/use-media-stream";
import { RenderIf } from "@/components/shared";
import UploadIcon from "../icons/NetworkStats/UploadIcon";
import DownloadIcon from "../icons/NetworkStats/DownloadIcon";
import RefreshIcon from "../icons/NetworkStats/RefreshIcon";
import RefreshCheck from "../icons/NetworkStats/RefreshCheck";
import WifiOff from "../icons/NetworkStats/WifiOff";

const NetworkStats: React.FC = () => {
  const { videoSDK } = useMediaStream();
  const [error, setError] = useState<string>("no-error-loading");
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);

  useEffect(() => {
    if (videoSDK) {
      getNetworkStatistics();
    }
  }, [videoSDK]);

  const getNetworkStatistics = async () => {
    if (!videoSDK) return;

    setError("no-error-loading");
    try {
      const options = { timeoutDuration: 45000 };
      const networkStats = await videoSDK.getNetworkStats(options);

      if (networkStats) {
        setError("no-error");
        setDownloadSpeed(networkStats.downloadSpeed ?? 0);
        setUploadSpeed(networkStats.uploadSpeed ?? 0);
      }
    } catch (ex) {
      if (ex === "Not able to get NetworkStats due to no Network") {
        setError("no-wifi");
      } else if (ex === "Not able to get NetworkStats due to timeout") {
        setError("timeout");
      }
      console.error("Error in networkStats: ", ex);
    }
  };

  const handleOnClick = () => {
    getNetworkStatistics();
  };

  return (
    <Card className="flex flex-row items-center justify-between space-x-4 border border-[#3F4346] divide-x divide-[#3F4346] rounded-md bg-black opacity-80 h-9">
      <RenderIf condition={error === "no-error-loading"}>
        <CardContent className="flex items-center gap-3 text-xs text-customGray-250">
          Checking network speeds
          <RefreshCheck />
        </CardContent>
      </RenderIf>

      <RenderIf condition={error === "no-error"}>
        <>
          <CardContent className="group inline-flex items-center gap-2 text-xs text-customGray-250 w-32">
            <DownloadIcon />
            {downloadSpeed} MBPS
          </CardContent>
          <CardContent className="group inline-flex items-center gap-2 text-xs text-customGray-250 w-32">
            <UploadIcon />
            {uploadSpeed} MBPS
          </CardContent>
          <div className="flex items-center justify-center w-16">
            <Button variant="ghost" onClick={handleOnClick}>
              <RefreshIcon />
            </Button>
          </div>
        </>
      </RenderIf>

      <RenderIf condition={error === "no-wifi"}>
        <>
          <CardContent className="group inline-flex items-center gap-3 text-xs text-red-250 p-2">
            <WifiOff />
            You're offline! Check your connection
          </CardContent>
          <div className="flex items-center justify-center p-2">
            <Button variant="ghost" onClick={handleOnClick}>
              <RefreshIcon />
            </Button>
          </div>
        </>
      </RenderIf>

      <RenderIf condition={error === "timeout"}>
        <>
          <CardContent className="group inline-flex items-center gap-3 text-xs text-red-250 p-2">
            Something went wrong! Couldn't load data
          </CardContent>
          <div className="flex items-center justify-center p-2">
            <Button variant="ghost" onClick={handleOnClick}>
              <RefreshIcon />
            </Button>
          </div>
        </>
      </RenderIf>
    </Card>
  );
};

export default NetworkStats;
