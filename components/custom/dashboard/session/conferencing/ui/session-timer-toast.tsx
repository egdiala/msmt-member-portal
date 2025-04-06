"use client";

import { X} from "lucide-react";
import { useState } from "react";
import { IconBadgeCheck } from "@/components/icons";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SessionTimerProps {
  timeRemaining?: string;
  onExtend?: () => void;
}

export default function SessionTimerAlert({
  timeRemaining = "09:55",
  onExtend = () => console.log("Session extended"),
}: SessionTimerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert className="relative w-full flex flex-col justify-center items-center max-w-[200px] bg-white dark:bg-neutral-900 border border-gray-200 p-3 dark:border-gray-800 shadow-md rounded-lg">
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>

      {/* Title and timer */}
      <div>
        <div className="text-center py-2 space-y-1">
          <AlertTitle className="text-sm font-semibold text-brand-1">
            This session ends in
          </AlertTitle>
          <div className="text-lg font-semibold text-brand-1">
            {timeRemaining}
          </div>
        </div>

        {/* Description */}
        <AlertDescription className="text-center text-xs text-brand-2 pt-1">
          This provider’s next hour is free. You can extend the session for
          another hour.
        </AlertDescription>

        {/* Extend button */}
        <div className="mt-4 px-4 pb-4 w-full">
          <Button
            className="w-full  text-white"
            onClick={() => {
              onExtend();
              setVisible(false);
            }}
          >
            <IconBadgeCheck className=" h-4 w-4 stroke-white" />
            Extend Session
          </Button>
        </div>
      </div>
    </Alert>
  );
}
