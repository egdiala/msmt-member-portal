"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RenderIf } from "@/components/shared";

type MeetingDetailsScreenProps = {
  onClickJoin: (meetingId: string) => void;
  _handleOnCreateMeeting: () => Promise<{ meetingId?: string; err?: string }>;
  participantName: string;
  setParticipantName: (name: string) => void;
  onClickStartMeeting: () => void;
};

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  onClickStartMeeting,
}: MeetingDetailsScreenProps) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCreateMeetingClicked, setIsCreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleMeetingAction = () => {
    if (isCreateMeetingClicked) {
      onClickStartMeeting();
    } else {
      if (meetingId.match("\\w{4}-\\w{4}-\\w{4}")) {
        onClickJoin(meetingId);
      } else {
        setMeetingIdError(true);
      }
    }
  };

  const handleCreateMeeting = async () => {
    const { meetingId: newMeetingId, err } = await _handleOnCreateMeeting();
    if (newMeetingId) {
      setMeetingId(newMeetingId);
      setIsCreateMeetingClicked(true);
    } else if (err) {
      toast.error(err, {
        description: err,
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center w-full p-2 md:p-6">
      <RenderIf condition={isCreateMeetingClicked}>
        <Card className="flex items-center justify-center space-x-2">
          <CardContent className="flex items-center py-4">
            <p className="text-base">{`Meeting code: ${meetingId}`}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="ml-2"
            >
              {isCopied ? (
                <CheckIcon className="h-5 w-5 text-green-400" />
              ) : (
                <ClipboardIcon className="h-5 w-5" />
              )}
            </Button>
          </CardContent>
        </Card>
      </RenderIf>

      <RenderIf condition={isJoinMeetingClicked}>
        <div className="space-y-2">
          <Input
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            placeholder="Enter meeting ID"
            className="text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600 text-center">
              Please enter a valid meeting ID
            </p>
          )}
        </div>
      </RenderIf>

      <RenderIf condition={isCreateMeetingClicked || isJoinMeetingClicked}>
        <div className="mt-5 space-y-5">
          <Input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="text-center"
          />
          <Button
            onClick={handleMeetingAction}
            disabled={participantName.length < 3}
            className="w-full"
            variant={participantName.length < 3 ? "secondary" : "default"}
          >
            {isCreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </Button>
        </div>
      </RenderIf>

      <RenderIf condition={!isCreateMeetingClicked && !isJoinMeetingClicked}>
        <div className="mt-4 space-y-5">
          <Button className="w-full" onClick={handleCreateMeeting}>
            Create a meeting
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setIsJoinMeetingClicked(true)}
          >
            Join a meeting
          </Button>
        </div>
      </RenderIf>
    </div>
  );
}
